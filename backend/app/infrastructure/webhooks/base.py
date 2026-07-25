"""Abstract base parser for gateway webhook payloads.

Each concrete parser normalises the gateway-specific payload into a
canonical dict consumed by the webhook service:

    {
        "source": "stripe",
        "event_type": "payment_intent.succeeded",
        "external_id": "evt_123",
        "transaction_ref": "pi_abc",
        "gateway_transaction_id": "pi_abc",
        "status": "success" | "failed" | "refunded" | ...,
        "amount": 100.00,
        "currency": "INR",
        "metadata": { ... },
    }
"""

import abc
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ParsedWebhook:
    source: str
    event_type: str
    external_id: str | None = None
    transaction_ref: str | None = None
    gateway_transaction_id: str | None = None
    status: str | None = None
    amount: float | None = None
    currency: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    raw_payload: dict[str, Any] = field(default_factory=dict)


class BaseWebhookParser(abc.ABC):
    """Parse a raw gateway webhook payload into a normalised ParsedWebhook."""

    @property
    @abc.abstractmethod
    def source(self) -> str: ...

    @abc.abstractmethod
    def parse(self, payload: dict[str, Any], headers: dict[str, str] | None = None) -> ParsedWebhook: ...

    def supports_event(self, event_type: str) -> bool:
        return True
