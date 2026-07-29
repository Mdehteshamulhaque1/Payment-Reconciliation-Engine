from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DeviceFingerprint(Base):
    __tablename__ = "device_fingerprints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    fingerprint_hash: Mapped[str] = mapped_column(String(128), nullable=False, unique=True, index=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    screen_resolution: Mapped[str | None] = mapped_column(String(32), nullable=True)
    color_depth: Mapped[int | None] = mapped_column(Integer, nullable=True)
    timezone_offset: Mapped[int | None] = mapped_column(Integer, nullable=True)
    platform: Mapped[str | None] = mapped_column(String(64), nullable=True)
    language: Mapped[str | None] = mapped_column(String(16), nullable=True)
    hardware_concurrency: Mapped[int | None] = mapped_column(Integer, nullable=True)
    device_memory: Mapped[float | None] = mapped_column(Float, nullable=True)
    fonts: Mapped[str | None] = mapped_column(Text, nullable=True)
    plugins: Mapped[str | None] = mapped_column(Text, nullable=True)
    webgl_renderer: Mapped[str | None] = mapped_column(String(256), nullable=True)
    canvas_fingerprint: Mapped[str | None] = mapped_column(String(128), nullable=True)
    audio_fingerprint: Mapped[str | None] = mapped_column(String(128), nullable=True)
    touch_support: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    cookies_enabled: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    last_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)
    is_suspicious: Mapped[bool] = mapped_column(Boolean, default=False)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
