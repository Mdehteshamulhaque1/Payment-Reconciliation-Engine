"""Type aliases and sentinel types for the payment reconciliation engine.

Centralizes commonly used type patterns to reduce duplication
and improve readability across the codebase.

Usage:
    from app.utils.typing_helpers import JSON, Headers, TransactionData

    data: JSON = {"status": "success", "amount": 100.0}
    headers: Headers = {"Authorization": "Bearer ..."}
"""

from __future__ import annotations

from typing import Any, TypeAlias, TypeVar

# ── JSON types ────────────────────────────────────────────────────────────
JSON: TypeAlias = dict[str, Any]
JSONList: TypeAlias = list[JSON]
JSONArray: TypeAlias = list[Any]

# ── HTTP types ────────────────────────────────────────────────────────────
Headers: TypeAlias = dict[str, str]
QueryParams: TypeAlias = dict[str, str | int | float | bool]
StatusCode: TypeAlias = int

# ── Database types ────────────────────────────────────────────────────────
Row: TypeAlias = dict[str, Any]
Rows: TypeAlias = list[Row]
Filters: TypeAlias = list[Any]  # SQLAlchemy BinaryExpression list

# ── Payment types ─────────────────────────────────────────────────────────
Amount: TypeAlias = float
Currency: TypeAlias = str  # ISO 4217
TransactionRef: TypeAlias = str
GatewayTxnId: TypeAlias = str
IdempotencyKey: TypeAlias = str

# ── Audit types ───────────────────────────────────────────────────────────
Actor: TypeAlias = str  # "system", "user:<id>", "webhook:<source>"
IpAddress: TypeAlias = str
UserAgent: TypeAlias = str

# ── Timestamp types ───────────────────────────────────────────────────────
ISODateTime: TypeAlias = str  # ISO 8601 formatted datetime string
UnixTimestamp: TypeAlias = float  # Seconds since epoch

# ── Configuration types ───────────────────────────────────────────────────
EnvVar: TypeAlias = str
Secret: TypeAlias = str

# ── Generic sentinel for missing values ───────────────────────────────────
_MISSING: Any = object()


def is_missing(value: Any) -> bool:
    """Check if a value is the sentinel MISSING object.

    >>> from app.utils.typing_helpers import _MISSING, is_missing
    >>> is_missing(_MISSING)
    True
    >>> is_missing(None)
    False
    """
    return value is _MISSING


# ── TypedDict-like patterns using Protocol ───────────────────────────────
class TransactionPayload:
    """Expected shape of transaction creation data."""

    transaction_ref: str
    amount: float
    currency: str
    merchant_id: int | None
    gateway_id: int | None
    idempotency_key: str | None


class WebhookPayload:
    """Expected shape of incoming webhook data."""

    source: str
    event_type: str
    data: JSON
    signature: str | None
    timestamp: ISODateTime


class ReconciliationResult:
    """Expected shape of a reconciliation result."""

    transaction_id: int
    internal_status: str
    gateway_status: str
    settlement_status: str | None
    bank_status: str | None
    match_type: str
    discrepancy_type: str
    match_score: float
    discrepancies: list[str]


class FraudAlert:
    """Expected shape of a fraud detection alert."""

    transaction_id: int
    is_suspicious: bool
    risk_score: float
    fraud_type: str | None
    factors: list[str]
    case_id: int | None


class HealthStatus:
    """Expected shape of a health check response."""

    status: str  # "healthy", "degraded", "unhealthy"
    database: str
    redis: str
    version: str
    environment: str
