from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BehavioralProfile(Base):
    __tablename__ = "behavioral_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    entity_type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    avg_amount: Mapped[float] = mapped_column(Float, default=0.0)
    avg_amount_30d: Mapped[float] = mapped_column(Float, default=0.0)
    avg_amount_7d: Mapped[float] = mapped_column(Float, default=0.0)
    std_amount: Mapped[float] = mapped_column(Float, default=0.0)
    txn_count_total: Mapped[int] = mapped_column(Integer, default=0)
    txn_count_30d: Mapped[int] = mapped_column(Integer, default=0)
    txn_count_7d: Mapped[int] = mapped_column(Integer, default=0)
    txn_count_24h: Mapped[int] = mapped_column(Integer, default=0)
    preferred_currency: Mapped[str | None] = mapped_column(String(8), nullable=True)
    preferred_hour_start: Mapped[int | None] = mapped_column(Integer, nullable=True)
    preferred_hour_end: Mapped[int | None] = mapped_column(Integer, nullable=True)
    preferred_gateway_ids: Mapped[str | None] = mapped_column(String(256), nullable=True)
    top_merchant_ids: Mapped[str | None] = mapped_column(Text, nullable=True)
    failure_rate: Mapped[float] = mapped_column(Float, default=0.0)
    avg_txn_interval_minutes: Mapped[float] = mapped_column(Float, default=0.0)
    last_txn_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    common_cities: Mapped[str | None] = mapped_column(Text, nullable=True)
    common_countries: Mapped[str | None] = mapped_column(String(256), nullable=True)
    known_device_ids: Mapped[str | None] = mapped_column(Text, nullable=True)
    profile_risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    profile_risk_level: Mapped[str] = mapped_column(String(16), default="low")
    last_updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
