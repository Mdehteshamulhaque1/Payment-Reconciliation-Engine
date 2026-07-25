import abc
import random
import time
import uuid
from dataclasses import dataclass, field


@dataclass
class GatewayResponse:
    success: bool
    gateway_transaction_id: str
    status: str
    amount: float
    currency: str
    latency_ms: float
    error_message: str | None = None
    raw_response: dict = field(default_factory=dict)


class BaseGatewaySimulator(abc.ABC):
    def __init__(self, failure_rate: float = 0.1, timeout_rate: float = 0.05, min_latency_ms: float = 100, max_latency_ms: float = 2000):
        self.failure_rate = failure_rate
        self.timeout_rate = timeout_rate
        self.min_latency_ms = min_latency_ms
        self.max_latency_ms = max_latency_ms

    def simulate_latency(self) -> float:
        latency = random.uniform(self.min_latency_ms, self.max_latency_ms)
        time.sleep(latency / 1000)
        return latency

    def should_fail(self) -> bool:
        return random.random() < self.failure_rate

    def should_timeout(self) -> bool:
        return random.random() < self.timeout_rate

    def generate_gateway_txn_id(self) -> str:
        return f"{self.gateway_prefix}_{uuid.uuid4().hex[:16]}"

    @property
    @abc.abstractmethod
    def gateway_prefix(self) -> str: ...

    @abc.abstractmethod
    def _process_payment(self, amount: float, currency: str, metadata: dict) -> dict: ...

    @abc.abstractmethod
    def _process_refund(self, gateway_txn_id: str, amount: float) -> dict: ...

    def process_payment(self, amount: float, currency: str = "INR", metadata: dict | None = None) -> GatewayResponse:
        metadata = metadata or {}
        start = time.perf_counter()

        if self.should_timeout():
            return GatewayResponse(
                success=False,
                gateway_transaction_id="",
                status="timeout",
                amount=amount,
                currency=currency,
                latency_ms=round((time.perf_counter() - start) * 1000, 2),
                error_message="Gateway timeout",
            )

        latency = self.simulate_latency()

        if self.should_fail():
            errors = ["insufficient_funds", "card_declined", "expired_card", "invalid_card", "network_error"]
            return GatewayResponse(
                success=False,
                gateway_transaction_id=self.generate_gateway_txn_id(),
                status="failed",
                amount=amount,
                currency=currency,
                latency_ms=round(latency, 2),
                error_message=random.choice(errors),
            )

        result = self._process_payment(amount, currency, metadata)
        return GatewayResponse(
            success=True,
            gateway_transaction_id=result.get("gateway_txn_id", self.generate_gateway_txn_id()),
            status="captured",
            amount=amount,
            currency=currency,
            latency_ms=round(latency, 2),
            raw_response=result,
        )

    def process_refund(self, gateway_txn_id: str, amount: float) -> GatewayResponse:
        latency = self.simulate_latency()
        result = self._process_refund(gateway_txn_id, amount)
        return GatewayResponse(
            success=True,
            gateway_transaction_id=gateway_txn_id,
            status="refunded",
            amount=amount,
            currency="INR",
            latency_ms=round(latency, 2),
            raw_response=result,
        )
