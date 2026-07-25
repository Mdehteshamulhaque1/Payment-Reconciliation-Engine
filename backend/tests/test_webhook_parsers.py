import pytest
from app.infrastructure.webhooks.stripe_parser import StripeWebhookParser
from app.infrastructure.webhooks.razorpay_parser import RazorpayWebhookParser
from app.infrastructure.webhooks.paypal_parser import PayPalWebhookParser
from app.infrastructure.webhooks import parse_webhook, PARSER_REGISTRY


class TestStripeParser:
    def setup_method(self):
        self.parser = StripeWebhookParser()

    def test_parse_payment_succeeded(self):
        payload = {
            "id": "evt_123",
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_abc123",
                    "amount": 5000,
                    "currency": "usd",
                    "customer": "cus_xyz",
                }
            },
        }
        result = self.parser.parse(payload)
        assert result.source == "stripe"
        assert result.event_type == "payment_intent.succeeded"
        assert result.external_id == "evt_123"
        assert result.gateway_transaction_id == "pi_abc123"
        assert result.status == "success"
        assert result.amount == 50.0
        assert result.currency == "USD"

    def test_parse_payment_failed(self):
        payload = {
            "id": "evt_456",
            "type": "payment_intent.payment_failed",
            "data": {"object": {"id": "pi_def456", "amount": 1000, "currency": "inr"}},
        }
        result = self.parser.parse(payload)
        assert result.status == "failed"

    def test_parse_charge_refunded(self):
        payload = {
            "id": "evt_789",
            "type": "charge.refunded",
            "data": {"object": {"id": "ch_abc", "amount": 2000, "currency": "eur"}},
        }
        result = self.parser.parse(payload)
        assert result.status == "refunded"

    def test_supports_known_events(self):
        assert self.parser.supports_event("payment_intent.succeeded")
        assert self.parser.supports_event("charge.refunded")
        assert not self.parser.supports_event("customer.created")

    def test_source_is_stripe(self):
        assert self.parser.source == "stripe"


class TestRazorpayParser:
    def setup_method(self):
        self.parser = RazorpayWebhookParser()

    def test_parse_payment_captured(self):
        payload = {
            "id": "evt_rp_001",
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_abc123",
                        "amount": 100000,
                        "currency": "INR",
                        "method": "upi",
                        "contact": "+919999999999",
                    }
                }
            },
        }
        result = self.parser.parse(payload)
        assert result.source == "razorpay"
        assert result.status == "success"
        assert result.amount == 1000.0
        assert result.gateway_transaction_id == "pay_abc123"
        assert result.metadata["method"] == "upi"

    def test_parse_payment_failed(self):
        payload = {
            "id": "evt_rp_002",
            "event": "payment.failed",
            "payload": {
                "payment": {
                    "entity": {"id": "pay_fail", "amount": 5000, "currency": "INR"}
                }
            },
        }
        result = self.parser.parse(payload)
        assert result.status == "failed"

    def test_source_is_razorpay(self):
        assert self.parser.source == "razorpay"


class TestPayPalParser:
    def setup_method(self):
        self.parser = PayPalWebhookParser()

    def test_parse_capture_completed(self):
        payload = {
            "id": "WH_pp_001",
            "event_type": "PAYMENT.CAPTURE.COMPLETED",
            "resource": {
                "id": "cap_abc",
                "resource_type": "capture",
                "amount": {"total": "250.00", "currency_code": "USD"},
                "parent_payment": "pay_pp_123",
            },
        }
        result = self.parser.parse(payload)
        assert result.source == "paypal"
        assert result.status == "success"
        assert result.amount == 250.0
        assert result.currency == "USD"
        assert result.gateway_transaction_id == "cap_abc"

    def test_parse_capture_denied(self):
        payload = {
            "id": "WH_pp_002",
            "event_type": "PAYMENT.CAPTURE.DENIED",
            "resource": {
                "id": "cap_denied",
                "amount": {"total": "100.00", "currency_code": "GBP"},
            },
        }
        result = self.parser.parse(payload)
        assert result.status == "failed"
        assert result.currency == "GBP"

    def test_source_is_paypal(self):
        assert self.parser.source == "paypal"


class TestWebhookRegistry:
    def test_all_sources_registered(self):
        assert "stripe" in PARSER_REGISTRY
        assert "razorpay" in PARSER_REGISTRY
        assert "paypal" in PARSER_REGISTRY

    def test_parse_webhook_dispatches(self):
        payload = {
            "id": "evt_test",
            "type": "payment_intent.succeeded",
            "data": {"object": {"id": "pi_test", "amount": 100, "currency": "usd"}},
        }
        result = parse_webhook("stripe", payload)
        assert result is not None
        assert result.source == "stripe"

    def test_unknown_source_returns_none(self):
        result = parse_webhook("unknown_gateway", {})
        assert result is None
