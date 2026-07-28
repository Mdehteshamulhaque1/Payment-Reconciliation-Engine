"""Reusable validators for payment system data.

Pure Python validators that return (is_valid, error_message) tuples.
No framework dependencies — can be used in services, schemas, or CLI.

Usage:
    from app.utils.validators import validate_currency, validate_amount

    is_valid, error = validate_currency("USD")
    is_valid, error = validate_amount(-100)  # (False, "Amount must be positive")
"""

from __future__ import annotations

import re
from decimal import Decimal, InvalidOperation
from typing import Any

# ISO 4217 currency codes supported by the system
SUPPORTED_CURRENCIES: frozenset[str] = frozenset({
    "INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "SGD",
    "AED", "SAR", "QAR", "KWD", "BHD", "OMR", "MYR", "THB",
    "IDR", "PHP", "VND", "KRW", "CNY", "HKD", "TWD", "NZD",
    "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "BRL",
    "MXN", "ARS", "CLP", "COP", "PEN", "ZAR", "NGN", "KES",
    "EGP", "PKR", "BDT", "LKR", "NPR", "MMK", "KHR", "LAK",
})

# Transaction status machine — valid transitions
VALID_STATUS_TRANSITIONS: dict[str, set[str]] = {
    "created": {"pending", "cancelled"},
    "pending": {"processing", "failed", "cancelled"},
    "processing": {"success", "failed"},
    "success": {"refunded", "disputed", "reconciled"},
    "failed": {"pending"},  # retry
    "cancelled": set(),
    "refunded": {"reconciled"},
    "partially_refunded": {"refunded", "reconciled"},
    "disputed": {"refunded", "reconciled"},
    "reconciled": set(),
}

# Regex for transaction references
TRANSACTION_REF_PATTERN = re.compile(r"^[A-Z0-9_-]{4,64}$")

# Email validation (RFC 5322 simplified)
EMAIL_PATTERN = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]"
    r"(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
    r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
)


def validate_currency(code: str) -> tuple[bool, str]:
    """Validate ISO 4217 currency code against supported currencies.

    Returns:
        Tuple of (is_valid, error_message). error_message is empty string if valid.

    >>> validate_currency("INR")
    (True, '')
    >>> validate_currency("XYZ")
    (False, 'Unsupported currency: XYZ')
    """
    if not code or not isinstance(code, str):
        return False, "Currency code is required"
    code = code.strip().upper()
    if len(code) != 3:
        return False, f"Currency code must be 3 characters, got {len(code)}"
    if code not in SUPPORTED_CURRENCIES:
        return False, f"Unsupported currency: {code}"
    return True, ""


def validate_amount(
    amount: Any,
    *,
    min_value: float = 0.01,
    max_value: float = 999_999_999.99,
    allow_zero: bool = False,
) -> tuple[bool, str]:
    """Validate a monetary amount.

    Args:
        amount: The amount to validate (int, float, str, or Decimal).
        min_value: Minimum allowed amount.
        max_value: Maximum allowed amount.
        allow_zero: Whether zero is a valid amount.

    Returns:
        Tuple of (is_valid, error_message).

    >>> validate_amount(100.50)
    (True, '')
    >>> validate_amount(-5)
    (False, 'Amount must be positive')
    """
    try:
        decimal_amount = Decimal(str(amount))
    except (InvalidOperation, TypeError, ValueError):
        return False, f"Invalid amount value: {amount}"

    if decimal_amount < 0:
        return False, "Amount must be positive"

    if not allow_zero and decimal_amount == 0:
        return False, "Amount cannot be zero"

    if decimal_amount < Decimal(str(min_value)):
        return False, f"Amount must be at least {min_value}"

    if decimal_amount > Decimal(str(max_value)):
        return False, f"Amount cannot exceed {max_value}"

    # Check for too many decimal places (max 2 for most currencies)
    if decimal_amount.as_tuple().exponent < -2:
        return False, "Amount cannot have more than 2 decimal places"

    return True, ""


def validate_email(email: str) -> tuple[bool, str]:
    """Validate email address format.

    Uses a simplified RFC 5322 pattern. Not exhaustive but covers
    the vast majority of real-world email addresses.

    >>> validate_email("user@example.com")
    (True, '')
    >>> validate_email("not-an-email")
    (False, 'Invalid email format')
    """
    if not email or not isinstance(email, str):
        return False, "Email is required"
    email = email.strip().lower()
    if len(email) > 254:
        return False, "Email address is too long (max 254 characters)"
    if not EMAIL_PATTERN.match(email):
        return False, "Invalid email format"
    if ".." in email:
        return False, "Email address cannot contain consecutive dots"
    return True, ""


def validate_transaction_ref(ref: str) -> tuple[bool, str]:
    """Validate transaction reference format.

    Must be 4-64 characters: uppercase letters, digits, underscores, hyphens.

    >>> validate_transaction_ref("TXN_2024_001")
    (True, '')
    >>> validate_transaction_ref("ab")
    (False, 'Transaction reference must be 4-64 characters')
    """
    if not ref or not isinstance(ref, str):
        return False, "Transaction reference is required"
    if not TRANSACTION_REF_PATTERN.match(ref):
        return False, "Transaction reference must be 4-64 characters (A-Z, 0-9, _, -)"
    return True, ""


def validate_status_transition(current: str, target: str) -> tuple[bool, str]:
    """Validate that a status transition is allowed.

    Uses the VALID_STATUS_TRANSITIONS state machine to enforce
    valid transaction lifecycle transitions.

    >>> validate_status_transition("created", "pending")
    (True, '')
    >>> validate_status_transition("success", "created")
    (False, 'Invalid transition: success -> created')
    """
    if current not in VALID_STATUS_TRANSITIONS:
        return False, f"Unknown current status: {current}"
    allowed = VALID_STATUS_TRANSITIONS[current]
    if target not in allowed:
        return False, f"Invalid transition: {current} -> {target}"
    return True, ""


def validate_batch_size(size: Any, *, max_size: int = 1000) -> tuple[bool, str]:
    """Validate batch operation size.

    >>> validate_batch_size(500)
    (True, '')
    >>> validate_batch_size(0)
    (False, 'Batch size must be at least 1')
    """
    try:
        int_size = int(size)
    except (TypeError, ValueError):
        return False, f"Invalid batch size: {size}"
    if int_size < 1:
        return False, "Batch size must be at least 1"
    if int_size > max_size:
        return False, f"Batch size cannot exceed {max_size}"
    return True, ""


def validate_pagination(page: Any, size: Any) -> tuple[bool, str]:
    """Validate pagination parameters.

    >>> validate_pagination(1, 20)
    (True, '')
    >>> validate_pagination(0, 20)
    (False, 'Page must be >= 1')
    """
    try:
        p, s = int(page), int(size)
    except (TypeError, ValueError):
        return False, "Page and size must be integers"
    if p < 1:
        return False, "Page must be >= 1"
    if s < 1 or s > 100:
        return False, "Size must be between 1 and 100"
    return True, ""
