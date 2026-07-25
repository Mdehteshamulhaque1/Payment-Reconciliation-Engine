from app.infrastructure.gateways.base import BaseGatewaySimulator


class BankTransferSimulator(BaseGatewaySimulator):
    gateway_prefix = "bank"

    def __init__(self, **kwargs):
        kwargs.setdefault("min_latency_ms", 500)
        kwargs.setdefault("max_latency_ms", 5000)
        super().__init__(**kwargs)

    def _process_payment(self, amount: float, currency: str, metadata: dict) -> dict:
        return {
            "gateway_txn_id": self.generate_gateway_txn_id(),
            "utr": f"UTR{self.generate_gateway_txn_id()}",
            "status": "SETTLED",
            "amount": str(amount),
            "currency": currency.upper(),
        }

    def _process_refund(self, gateway_txn_id: str, amount: float) -> dict:
        return {
            "utr": f"UTRRV_{gateway_txn_id[:16]}",
            "status": "SETTLED",
            "amount": str(amount),
        }
