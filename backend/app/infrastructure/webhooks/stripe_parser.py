"""Stripe webhook payload parser.

Handles events: payment_intent.succeeded, payment_intent.payment_failed,
charge.refunded, charge.dispute.created, payout.paid, payout.failed.
"""

from typing import Any

from app.infrastructure.webhooks.base import BaseWebhookParser, ParsedWebhook

_STATUS_MAP: dict[str, str] = {
    "payment_intent.succeeded": "success",
    "payment_intent.payment_failed": "failed",
    "charge.refunded": "refunded",
    "charge.dispute.created": "disputed",
    "payout.paid": "settled",
    "payout.failed": "failed",
}


class StripeWebhookParser(BaseWebhookParser):
    source = "stripe"

    def parse(self, payload: dict[str, Any], headers: dict[str, str] | None = None) -> ParsedWebhook:
        event_type = payload.get("type", "unknown")
        external_id = payload.get("id")
        data_object = payload.get("data", {}).get("object", {})

        gateway_txn_id = (
            data_object.get("id")
            or data_object.get("payment_intent")
            or data_object.get("charge")
        )

        amount_raw = data_object.get("amount")
        amount = amount_raw / 100.0 if amount_raw is not None else None

        return ParsedWebhook(
            source=self.source,
            event_type=event_type,
            external_id=external_id,
            gateway_transaction_id=gateway_txn_id,
            status=_STATUS_MAP.get(event_type),
            amount=amount,
            currency=(data_object.get("currency") or "usd").upper(),
            metadata={
                "livemode": payload.get("livemode"),
                "api_version": payload.get("api_version"),
                "customer": data_object.get("customer"),
                "receipt_email": data_object.get("receipt_email"),
            },
            raw_payload=payload,
        )

    def supports_event(self, event_type: str) -> bool:
        return event_type in _STATUS_MAP
