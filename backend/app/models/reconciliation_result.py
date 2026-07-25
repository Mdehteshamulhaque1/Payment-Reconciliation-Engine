import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ReconciliationMatchType(str, enum.Enum):
    EXACT = "exact"
    FUZZY = "fuzzy"
    RULE_BASED = "rule_based"
    MANUAL = "manual"


class ReconciliationDiscrepancyType(str, enum.Enum):
    MATCH = "match"
    AMOUNT_MISMATCH = "amount_mismatch"
    MISSING_INTERNAL = "missing_internal"
    MISSING_GATEWAY = "missing_gateway"
    MISSING_SETTLEMENT = "missing_settlement"
    MISSING_BANK = "missing_bank"
    DUPLICATE = "duplicate"
    PARTIAL_SETTLEMENT = "partial_settlement"
    DELAYED = "delayed"


class ReconciliationResult(Base):
    __tablename__ = "reconciliation_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    transaction_id: Mapped[int] = mapped_column(Integer, ForeignKey("transactions.id"), nullable=False, index=True)
    batch_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    internal_status: Mapped[str | None] = mapped_column(String(30), nullable=True)
    gateway_status: Mapped[str | None] = mapped_column(String(30), nullable=True)
    settlement_status: Mapped[str | None] = mapped_column(String(30), nullable=True)
    bank_status: Mapped[str | None] = mapped_column(String(30), nullable=True)
    match_type: Mapped[ReconciliationMatchType | None] = mapped_column(
        SQLEnum(ReconciliationMatchType, name="recon_match_type"), nullable=True
    )
    discrepancy_type: Mapped[ReconciliationDiscrepancyType] = mapped_column(
        SQLEnum(ReconciliationDiscrepancyType, name="recon_discrepancy_type"),
        nullable=False,
        default=ReconciliationDiscrepancyType.MATCH,
        index=True,
    )
    match_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    discrepancies_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    resolved_by: Mapped[str | None] = mapped_column(String(100), nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
