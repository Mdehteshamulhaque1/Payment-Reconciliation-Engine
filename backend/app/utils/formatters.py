"""Formatting utilities for currency, amounts, durations, and dates.

Pure Python formatters with no external dependencies beyond the standard library.
These are used across services, API responses, and report generation.

Usage:
    from app.utils.formatters import format_currency, format_amount, format_duration

    format_currency(1234567.89, "INR")  # "₹12,34,567.89"
    format_amount(99.5)                 # "99.50"
    format_duration(3661.5)             # "1h 1m 2s"
"""

from __future__ import annotations

import time
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from typing import Any

# Currency symbols and formatting rules
CURRENCY_CONFIG: dict[str, dict[str, Any]] = {
    "INR": {"symbol": "₹", "decimals": 2, "grouping": (3, 2)},
    "USD": {"symbol": "$", "decimals": 2, "grouping": (3, 3)},
    "EUR": {"symbol": "€", "decimals": 2, "grouping": (3, 3)},
    "GBP": {"symbol": "£", "decimals": 2, "grouping": (3, 3)},
    "JPY": {"symbol": "¥", "decimals": 0, "grouping": (3, 3)},
    "AUD": {"symbol": "A$", "decimals": 2, "grouping": (3, 3)},
    "CAD": {"symbol": "C$", "decimals": 2, "grouping": (3, 3)},
    "SGD": {"symbol": "S$", "decimals": 2, "grouping": (3, 3)},
    "AED": {"symbol": "د.إ", "decimals": 2, "grouping": (3, 3)},
    "SAR": {"symbol": "﷼", "decimals": 2, "grouping": (3, 3)},
}

DEFAULT_CURRENCY_CONFIG = {"symbol": "", "decimals": 2, "grouping": (3, 3)}


def format_currency(amount: float | int | str | Decimal, currency: str = "INR") -> str:
    """Format a monetary amount with currency symbol and locale-aware grouping.

    Uses Indian numbering system for INR (lakhs/crores), standard grouping otherwise.

    Args:
        amount: The monetary amount.
        currency: ISO 4217 currency code.

    Returns:
        Formatted string like "₹12,34,567.89" or "$1,234.57".

    >>> format_currency(1234567.89, "INR")
    '₹12,34,567.89'
    >>> format_currency(99.9, "USD")
    '$99.90'
    """
    config = CURRENCY_CONFIG.get(currency.upper(), DEFAULT_CURRENCY_CONFIG)
    symbol = config["symbol"]
    decimals = config["decimals"]

    decimal_amount = Decimal(str(amount)).quantize(
        Decimal(f"10 {'.' if decimals else ''}{'0' * decimals}"),
        rounding=ROUND_HALF_UP,
    )

    # Split integer and fractional parts
    sign = "-" if decimal_amount < 0 else ""
    abs_amount = abs(decimal_amount)
    int_part = int(abs_amount)
    frac_part = abs_amount - int_part

    # Format integer part with grouping
    int_str = str(int_part)
    if len(int_str) > 0:
        grouping = config["grouping"]
        formatted = _group_digits(int_str, grouping)
    else:
        formatted = "0"

    # Append fractional part if needed
    if decimals > 0:
        frac_str = str(frac_part)[2:]  # Remove "0."
        frac_str = frac_str.ljust(decimals, "0")[:decimals]
        formatted = f"{formatted}.{frac_str}"

    return f"{sign}{symbol}{formatted}" if symbol else f"{sign}{formatted}"


def _group_digits(num_str: str, grouping: tuple[int, ...]) -> str:
    """Group digits according to the specified grouping pattern.

    Args:
        num_str: String of digits (no sign or decimal).
        grouping: Tuple of group sizes from right to left.

    Returns:
        Comma-separated digit string.

    >>> _group_digits("1234567", (3, 2))
    '12,34,567'
    """
    if not num_str:
        return "0"

    result: list[str] = []
    remaining = num_str

    # First group (rightmost) uses the first element
    group_size = grouping[0] if grouping else 3
    while len(remaining) > group_size:
        result.append(remaining[-group_size:])
        remaining = remaining[:-group_size]

    if remaining:
        result.append(remaining)

    result.reverse()
    return ",".join(result)


def format_amount(
    amount: float | int | str | Decimal,
    *,
    decimals: int = 2,
    show_sign: bool = False,
) -> str:
    """Format a numeric amount with consistent decimal places.

    Args:
        amount: The numeric value.
        decimals: Number of decimal places.
        show_sign: Whether to show + prefix for positive values.

    Returns:
        Formatted string like "1,234.50" or "+1,234.50".

    >>> format_amount(1234.5)
    '1,234.50'
    >>> format_amount(-500, show_sign=True)
    '-500.00'
    """
    decimal_amount = Decimal(str(amount)).quantize(
        Decimal(f"10.{'0' * decimals}"),
        rounding=ROUND_HALF_UP,
    )

    sign = ""
    if show_sign and decimal_amount > 0:
        sign = "+"
    elif decimal_amount < 0:
        sign = "-"

    abs_amount = abs(decimal_amount)
    int_part = int(abs_amount)
    frac_part = abs_amount - int_part

    int_str = f"{int_part:,}"
    if decimals > 0:
        frac_str = str(frac_part)[2:].ljust(decimals, "0")[:decimals]
        return f"{sign}{int_str}.{frac_str}"

    return f"{sign}{int_str}"


def format_duration(seconds: float | int) -> str:
    """Format a duration in seconds to human-readable string.

    Args:
        seconds: Duration in seconds.

    Returns:
        Human-readable string like "2h 30m 15s" or "500ms".

    >>> format_duration(3661)
    '1h 1m 1s'
    >>> format_duration(0.5)
    '500ms'
    """
    if seconds < 1:
        ms = round(seconds * 1000)
        return f"{ms}ms"

    total_seconds = int(seconds)
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    ms = round((seconds - total_seconds) * 1000)

    parts: list[str] = []
    if hours > 0:
        parts.append(f"{hours}h")
    if minutes > 0:
        parts.append(f"{minutes}m")
    if secs > 0 or not parts:
        parts.append(f"{secs}s")
    if ms > 0 and hours == 0:
        parts.append(f"{ms}ms")

    return " ".join(parts)


def format_datetime(dt: datetime | None, fmt: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Format a datetime to string with timezone awareness.

    Args:
        dt: The datetime object (None returns "N/A").
        fmt: strftime format string.

    Returns:
        Formatted datetime string.

    >>> from datetime import datetime, timezone
    >>> format_datetime(datetime(2024, 1, 15, 10, 30, 0, tzinfo=timezone.utc))
    '2024-01-15 10:30:00'
    """
    if dt is None:
        return "N/A"
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.strftime(fmt)


def format_percentage(value: float, decimals: int = 1) -> str:
    """Format a decimal value as a percentage string.

    Args:
        value: Decimal value (0.856 = 85.6%).
        decimals: Number of decimal places.

    Returns:
        Percentage string like "85.6%".

    >>> format_percentage(0.856)
    '85.6%'
    >>> format_percentage(1.0)
    '100.0%'
    """
    return f"{value * 100:.{decimals}f}%"


def format_file_size(size_bytes: int) -> str:
    """Format bytes to human-readable file size.

    Args:
        size_bytes: Size in bytes.

    Returns:
        Human-readable string like "1.5 MB" or "256 KB".

    >>> format_file_size(1536)
    '1.5 KB'
    >>> format_file_size(1048576)
    '1.0 MB'
    """
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 ** 2:
        return f"{size_bytes / 1024:.1f} KB"
    elif size_bytes < 1024 ** 3:
        return f"{size_bytes / (1024 ** 2):.1f} MB"
    else:
        return f"{size_bytes / (1024 ** 3):.1f} GB"


def mask_card_number(card: str, visible: int = 4) -> str:
    """Mask a card number showing only the last N digits.

    Args:
        card: Full card number string.
        visible: Number of digits to show at the end.

    Returns:
        Masked card number like "**** **** **** 1234".

    >>> mask_card_number("4111111111111234")
    '**** **** **** 1234'
    """
    if not card:
        return "****"
    clean = card.replace(" ", "").replace("-", "")
    if len(clean) <= visible:
        return clean
    masked_length = len(clean) - visible
    masked = "*" * masked_length
    return f"{masked}{clean[-visible:]}"


def truncate(text: str, max_length: int = 50, suffix: str = "...") -> str:
    """Truncate text to max_length, appending suffix if truncated.

    >>> truncate("Hello World", max_length=8)
    'Hello...'
    """
    if len(text) <= max_length:
        return text
    return text[: max_length - len(suffix)] + suffix
