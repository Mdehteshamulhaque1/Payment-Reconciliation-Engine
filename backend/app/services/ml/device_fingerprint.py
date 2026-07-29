import hashlib
import json
from typing import Any

import structlog
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.device_fingerprint import DeviceFingerprint

logger = structlog.get_logger("services.ml.device_fingerprint")


class DeviceFingerprinter:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def identify(self, device_data: dict[str, Any]) -> dict[str, Any]:
        fingerprint_hash = self._compute_hash(device_data)
        existing = await self.db.execute(
            select(DeviceFingerprint).where(DeviceFingerprint.fingerprint_hash == fingerprint_hash)
        )
        record = existing.scalar_one_or_none()

        if record:
            record.last_seen_at = func.now()
            is_new = False
        else:
            record = DeviceFingerprint(
                fingerprint_hash=fingerprint_hash,
                user_agent=device_data.get("userAgent", ""),
                screen_resolution=device_data.get("screenResolution", ""),
                color_depth=device_data.get("colorDepth"),
                timezone_offset=device_data.get("timezoneOffset"),
                platform=device_data.get("platform", ""),
                language=device_data.get("language", ""),
                hardware_concurrency=device_data.get("hardwareConcurrency"),
                device_memory=device_data.get("deviceMemory"),
                fonts=json.dumps(device_data.get("fonts", [])),
                plugins=json.dumps(device_data.get("plugins", [])),
                webgl_renderer=device_data.get("webglRenderer", ""),
                canvas_fingerprint=device_data.get("canvasFingerprint", ""),
                audio_fingerprint=device_data.get("audioFingerprint", ""),
                touch_support=device_data.get("touchSupport"),
                cookies_enabled=device_data.get("cookiesEnabled"),
                last_ip=device_data.get("ip", ""),
            )
            self.db.add(record)
            is_new = True

        if device_data.get("ip"):
            record.last_ip = device_data["ip"]

        suspicious = self._check_suspicious(record, device_data)
        if suspicious["is_suspicious"]:
            record.is_suspicious = True
            record.risk_score = suspicious["risk_score"]

        await self.db.commit()
        return {
            "fingerprint_hash": fingerprint_hash,
            "is_new_device": is_new,
            "device_id": record.id,
            "is_suspicious": record.is_suspicious,
            "risk_score": record.risk_score,
            "suspicious_reasons": suspicious["reasons"],
        }

    async def get_device_history(self, fingerprint_hash: str) -> list[DeviceFingerprint]:
        result = await self.db.execute(
            select(DeviceFingerprint).where(
                DeviceFingerprint.fingerprint_hash == fingerprint_hash
            ).order_by(DeviceFingerprint.last_seen_at.desc())
        )
        return list(result.scalars().all())

    def _compute_hash(self, data: dict[str, Any]) -> str:
        components = [
            str(data.get("userAgent", "")),
            str(data.get("screenResolution", "")),
            str(data.get("colorDepth", "")),
            str(data.get("platform", "")),
            str(data.get("language", "")),
            str(data.get("hardwareConcurrency", "")),
            str(data.get("deviceMemory", "")),
        ]
        raw = "|".join(components)
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def _check_suspicious(self, record: DeviceFingerprint, data: dict[str, Any]) -> dict:
        reasons = []
        risk = 0.0

        if data.get("headless") is True:
            reasons.append("Headless browser detected")
            risk += 0.6
        if data.get("webdriver") is True:
            reasons.append("WebDriver automation detected")
            risk += 0.5
        if data.get("screenResolution") and "x" in str(data.get("screenResolution", "")):
            parts = str(data["screenResolution"]).split("x")
            if len(parts) == 2:
                try:
                    w, h = int(parts[0]), int(parts[1])
                    if w < 800 or h < 600:
                        reasons.append(f"Unusual screen resolution: {w}x{h}")
                        risk += 0.2
                except ValueError:
                    pass
        if not data.get("cookiesEnabled"):
            reasons.append("Cookies disabled")
            risk += 0.1
        if not data.get("fonts") or len(data.get("fonts", [])) < 10:
            reasons.append("Missing or limited fonts")
            risk += 0.1

        return {"is_suspicious": risk > 0.3, "risk_score": round(min(risk, 1.0), 4), "reasons": reasons}
