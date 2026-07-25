from app.infrastructure.webhooks.base import BaseWebhookParser, ParsedWebhook
from app.infrastructure.webhooks.stripe_parser import StripeWebhookParser
from app.infrastructure.webhooks.razorpay_parser import RazorpayWebhookParser
from app.infrastructure.webhooks.paypal_parser import PayPalWebhookParser

PARSER_REGISTRY: dict[str, BaseWebhookParser] = {
    "stripe": StripeWebhookParser(),
    "razorpay": RazorpayWebhookParser(),
    "paypal": PayPalWebhookParser(),
}


def get_parser(source: str) -> BaseWebhookParser | None:
    return PARSER_REGISTRY.get(source.lower())


def parse_webhook(source: str, payload: dict, headers: dict[str, str] | None = None) -> ParsedWebhook | None:
    parser = get_parser(source)
    if parser is None:
        return None
    return parser.parse(payload, headers)


__all__ = [
    "BaseWebhookParser",
    "ParsedWebhook",
    "StripeWebhookParser",
    "RazorpayWebhookParser",
    "PayPalWebhookParser",
    "PARSER_REGISTRY",
    "get_parser",
    "parse_webhook",
]
