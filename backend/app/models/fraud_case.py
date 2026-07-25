import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class FraudType(str, enum.Enum):
    VELOCITY = "velocity"
    DUPLICATE = "duplicate"
    IMPOSSIBLE_LOCATION = "impossible_location"
    MULTIPLE_CARDS = "multiple_cards"
    REFUND_ABUSE = "refund_abuse"
    LARGE_TRANSACTION = "large_transaction"
    SUSPICIOUS_MERCHANT = "suspicious_merchant"
    RULE_TRIGGERED = "rule_triggered"


class FraudCaseStatus(str, enum.Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    CONFIRMED = "confirmed"
    FALSE_POSITIVE = "false_positive"
    RESOLVED = "resolved"


class FraudCase(Base):
    __tablename__ = "fraud_cases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    transaction_id: Mapped[int] = mapped_column(Integer, ForeignKey("transactions.id"), nullable=False, index=True)
    fraud_type: Mapped[FraudType] = mapped_column(
        SQLEnum(FraudType, name="fraud_type"), nullable=False, index=True
    )
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    evidence_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[FraudCaseStatus] = mapped_column(
        SQLEnum(FraudCaseStatus, name="fraud_case_status"),
        nullable=False,
        default=FraudCaseStatus.OPEN,
        index=True,
    )
    reviewer_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    review_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
