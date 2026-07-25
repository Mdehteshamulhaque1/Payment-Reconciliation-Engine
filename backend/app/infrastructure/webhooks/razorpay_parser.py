"""Razorpay webhook payload parser.

Handles events: payment.captured, payment.failed, payment.authorized,
refund.created, refund.processed, payout.processed, payout.failed.
"""

from typing import Any

from app.infrastructure.webhooks.base import BaseWebhookParser, ParsedWebhook

_STATUS_MAP: dict[str, str] = {
    "payment.captured": "success",
    "payment.authorized": "success",
    "payment.failed": "failed",
    "payment.dispute.created": "disputed",
    "refund.created": "refunded",
    "refund.processed": "refunded",
    "payout.processed": "settled",
    "payout.failed": "failed",
}


class RazorpayWebhookParser(BaseWebhookParser):
    source = "razorpay"

    def parse(self, payload: dict[str, Any], headers: dict[str, str] | None = None) -> ParsedWebhook:
        event_type = payload.get("event", "unknown")
        payload_entity = payload.get("payload", {})
        payment_entity = (
            payload_entity.get("payment", {}).get("entity", {})
            or payload_entity.get("refund", {}).get("entity", {})
            or payload_entity.get("payout", {}).get("entity", {})
        )

        amount_raw = payment_entity.get("amount")
        amount = amount_raw / 100.0 if amount_raw is not None else None

        return ParsedWebhook(
            source=self.source,
            event_type=event_type,
            external_id=payload.get("id") or payment_entity.get("id"),
            gateway_transaction_id=payment_entity.get("id") or payment_entity.get("payment_id"),
            status=_STATUS_MAP.get(event_type),
            amount=amount,
            currency=(payment_entity.get("currency") or "INR").upper(),
            metadata={
                "method": payment_entity.get("method"),
                "bank": payment_entity.get("bank"),
                "vpa": payment_entity.get("vpa"),
                "contact": payment_entity.get("contact"),
                "email": payment_entity.get("email"),
            },
            raw_payload=payload,
        )

    def supports_event(self, event_type: str) -> bool:
        return event_type in _STATUS_MAP
