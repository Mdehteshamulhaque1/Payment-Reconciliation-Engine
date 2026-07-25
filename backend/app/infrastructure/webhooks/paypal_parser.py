"""PayPal webhook payload parser.

Handles events: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED,
PAYMENT.CAPTURE.PENDING, CHECKOUT.ORDER.APPROVED, PAYMENT.CAPTURE.REFUNDED.
"""

from typing import Any

from app.infrastructure.webhooks.base import BaseWebhookParser, ParsedWebhook

_STATUS_MAP: dict[str, str] = {
    "PAYMENT.CAPTURE.COMPLETED": "success",
    "PAYMENT.CAPTURE.PENDING": "pending",
    "PAYMENT.CAPTURE.DENIED": "failed",
    "PAYMENT.CAPTURE.REFUNDED": "refunded",
    "CHECKOUT.ORDER.APPROVED": "success",
    "CHECKOUT.ORDER.COMPLETED": "success",
}


class PayPalWebhookParser(BaseWebhookParser):
    source = "paypal"

    def parse(self, payload: dict[str, Any], headers: dict[str, str] | None = None) -> ParsedWebhook:
        event_type = payload.get("event_type", "unknown")
        resource = payload.get("resource", {})
        resource_type = resource.get("resource_type", "")

        amount_obj = resource.get("amount", {})
        amount_raw = amount_obj.get("total")
        amount = float(amount_raw) if amount_raw else None

        return ParsedWebhook(
            source=self.source,
            event_type=event_type,
            external_id=payload.get("id") or resource.get("id"),
            gateway_transaction_id=resource.get("id") or resource.get("parent_payment"),
            status=_STATUS_MAP.get(event_type),
            amount=amount,
            currency=(amount_obj.get("currency_code") or "USD").upper(),
            metadata={
                "resource_type": resource_type,
                "custom_id": resource.get("custom_id"),
                "invoice_id": resource.get("invoice_id"),
                "payer_id": resource.get("payer", {}).get("payer_id"),
            },
            raw_payload=payload,
        )

    def supports_event(self, event_type: str) -> bool:
        return event_type in _STATUS_MAP
