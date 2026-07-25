from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BankRecord(Base):
    __tablename__ = "bank_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    bank_ref: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    settlement_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("settlements.id"), nullable=True, index=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="INR")
    transaction_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    raw_data: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_reconciled: Mapped[bool] = mapped_column(default=False, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
