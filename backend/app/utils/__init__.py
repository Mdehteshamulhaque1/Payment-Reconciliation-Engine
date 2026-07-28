"""Reusable Python utilities — decorators, context managers, validators, formatters, protocols.

This package provides Pythonic building blocks used across the payment reconciliation
engine. Each module focuses on a single concern and can be imported independently:

    from app.utils.decorators import timer, retry
    from app.utils.context_managers import suppress_exceptions, db_transaction
    from app.utils.protocols import Repository, PaymentGateway
"""

from app.utils.decorators import timer, retry, cached, rate_limit
from app.utils.context_managers import suppress_exceptions, db_timer, TimerContext
from app.utils.validators import validate_currency, validate_amount, validate_email
from app.utils.formatters import format_currency, format_amount, format_duration
from app.utils.protocols import Repository, PaymentGateway, Serializable
from app.utils.typing_helpers import JSON, Headers, QueryParams, StatusCode

__all__ = [
    # Decorators
    "timer",
    "retry",
    "cached",
    "rate_limit",
    # Context managers
    "suppress_exceptions",
    "db_timer",
    "TimerContext",
    # Validators
    "validate_currency",
    "validate_amount",
    "validate_email",
    # Formatters
    "format_currency",
    "format_amount",
    "format_duration",
    # Protocols
    "Repository",
    "PaymentGateway",
    "Serializable",
    # Type helpers
    "JSON",
    "Headers",
    "QueryParams",
    "StatusCode",
]
