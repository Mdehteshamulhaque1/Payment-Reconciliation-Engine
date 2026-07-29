from datetime import datetime, timedelta, timezone
from typing import Any

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction, TransactionStatus

logger = structlog.get_logger("services.ml.velocity_engine")

VELOCITY_WINDOWS = [
    {"name": "1m", "minutes": 1, "threshold": 5},
    {"name": "5m", "minutes": 5, "threshold": 15},
    {"name": "15m", "minutes": 15, "threshold": 30},
    {"name": "1h", "minutes": 60, "threshold": 100},
    {"name": "24h", "minutes": 1440, "threshold": 500},
]


class VelocityEngine:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def check_transaction(self, txn: Transaction) -> dict[str, Any]:
        now = datetime.now(timezone.utc)
        alerts = []
        max_risk = 0.0

        for window in VELOCITY_WINDOWS:
            cutoff = now - timedelta(minutes=window["minutes"])

            txn_time = txn.created_at
            if txn_time and txn_time.tzinfo is None:
                txn_time_cutoff = txn_time - timedelta(minutes=window["minutes"])
            else:
                txn_time_cutoff = cutoff

            merchant_count = await self.db.execute(
                select(func.count(Transaction.id)).where(
                    Transaction.merchant_id == txn.merchant_id,
                    Transaction.created_at >= txn_time_cutoff,
                )
            )
            merchant_total = merchant_count.scalar() or 0

            ip_count = 0
            customer_count = 0
            if txn.customer_id:
                customer_count_result = await self.db.execute(
                    select(func.count(Transaction.id)).where(
                        Transaction.customer_id == txn.customer_id,
                        Transaction.created_at >= txn_time_cutoff,
                    )
                )
                customer_count = customer_count_result.scalar() or 0

            threshold = window["threshold"]
            name = window["name"]

            if merchant_total > threshold * 2:
                risk = min(1.0, (merchant_total - threshold) / (threshold * 5))
                max_risk = max(max_risk, risk)
                alerts.append({
                    "window": name,
                    "metric": "merchant",
                    "count": merchant_total,
                    "threshold": threshold,
                    "risk": round(risk, 4),
                })
                logger.warning("velocity_alert", window=name, metric="merchant", count=merchant_total, threshold=threshold)

            if customer_count > threshold:
                risk = min(1.0, (customer_count - threshold) / (threshold * 3))
                max_risk = max(max_risk, risk)
                alerts.append({
                    "window": name,
                    "metric": "customer",
                    "count": customer_count,
                    "threshold": threshold,
                    "risk": round(risk, 4),
                })

        return {
            "velocity_alerts": alerts,
            "max_velocity_risk": round(max_risk, 4),
            "has_velocity_issue": len(alerts) > 0,
        }
