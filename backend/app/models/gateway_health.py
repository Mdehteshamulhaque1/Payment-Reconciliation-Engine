from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class GatewayHealth(Base):
    __tablename__ = "gateway_health"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    gateway_id: Mapped[int] = mapped_column(Integer, ForeignKey("payment_gateways.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    latency_ms: Mapped[float | None] = mapped_column(Float, nullable=True)
    uptime_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    last_checked: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    error_message: Mapped[str | None] = mapped_column(String(500), nullable=True)

    gateway = relationship("PaymentGateway", back_populates="health_records")
