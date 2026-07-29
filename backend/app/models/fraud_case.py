import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String, Text, func
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
    BEHAVIORAL_ANOMALY = "behavioral_anomaly"
    DEVICE_ANOMALY = "device_anomaly"
    GRAPH_ANOMALY = "graph_anomaly"
    IMPOSSIBLE_TRAVEL = "impossible_travel"
    ML_HIGH_RISK = "ml_high_risk"
    ENSEMBLE_HIGH_RISK = "ensemble_high_risk"


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
    fraud_type: Mapped[FraudType] = mapped_column(SQLEnum(FraudType, name="fraud_type"), nullable=False, index=True)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    ml_risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    rule_risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    model_contributions: Mapped[str | None] = mapped_column(Text, nullable=True)
    shap_explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    evidence_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[FraudCaseStatus] = mapped_column(SQLEnum(FraudCaseStatus, name="fraud_case_status"), nullable=False, default=FraudCaseStatus.OPEN, index=True)
    reviewer_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_to: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    escalated: Mapped[bool] = mapped_column(Boolean, default=False)
    escalated_to: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    tags: Mapped[str | None] = mapped_column(String(512), nullable=True)
    resolution: Mapped[str | None] = mapped_column(String(128), nullable=True)
    review_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
