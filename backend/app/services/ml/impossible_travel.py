import math
from datetime import datetime, timezone
from typing import Any

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction
from app.models.payment_location import PaymentLocation

logger = structlog.get_logger("services.ml.impossible_travel")

MAX_SPEED_KMH = 900.0


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


class ImpossibleTravelDetector:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def check_transaction(self, txn: Transaction) -> dict[str, Any]:
        if not txn.customer_id:
            return {"is_impossible_travel": False, "details": None}

        loc = await self.db.execute(
            select(PaymentLocation).where(PaymentLocation.transaction_id == txn.id)
        )
        current_loc = loc.scalar_one_or_none()
        if not current_loc:
            return {"is_impossible_travel": False, "details": None}

        current_time = txn.created_at
        if current_time and current_time.tzinfo is None:
            current_time = current_time.replace(tzinfo=timezone.utc)

        prev_txns = await self.db.execute(
            select(Transaction, PaymentLocation)
            .join(PaymentLocation, PaymentLocation.transaction_id == Transaction.id)
            .where(
                Transaction.customer_id == txn.customer_id,
                Transaction.id != txn.id,
                Transaction.created_at < txn.created_at,
            )
            .order_by(Transaction.created_at.desc())
            .limit(5)
        )
        prev_rows = prev_txns.all()

        violations = []
        for prev_txn, prev_loc in prev_rows:
            prev_time = prev_txn.created_at
            if prev_time and prev_time.tzinfo is None:
                prev_time = prev_time.replace(tzinfo=timezone.utc)

            if current_time is None or prev_time is None:
                continue

            time_diff_hours = (current_time - prev_time).total_seconds() / 3600.0
            if time_diff_hours <= 0:
                continue

            distance = haversine(
                current_loc.latitude, current_loc.longitude,
                prev_loc.latitude, prev_loc.longitude,
            )
            speed = distance / time_diff_hours

            if speed > MAX_SPEED_KMH:
                violations.append({
                    "prev_transaction_id": prev_txn.id,
                    "prev_transaction_ref": prev_txn.transaction_ref,
                    "prev_lat": prev_loc.latitude,
                    "prev_lon": prev_loc.longitude,
                    "current_lat": current_loc.latitude,
                    "current_lon": current_loc.longitude,
                    "distance_km": round(distance, 2),
                    "time_diff_hours": round(time_diff_hours, 4),
                    "speed_kmh": round(speed, 2),
                })

        if violations:
            max_speed = max(v["speed_kmh"] for v in violations)
            risk_score = min(1.0, max_speed / 5000.0)
            logger.warning("impossible_travel_detected", customer_id=txn.customer_id, max_speed=max_speed, violations=len(violations))
            return {
                "is_impossible_travel": True,
                "risk_score": round(risk_score, 4),
                "violations": violations,
            }

        return {"is_impossible_travel": False, "details": None}
