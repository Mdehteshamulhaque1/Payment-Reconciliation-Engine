import math
from datetime import datetime, timezone
from typing import Any

import numpy as np
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction, TransactionStatus
from app.models.payment_location import PaymentLocation

FEATURE_NAMES = [
    "amount", "amount_log", "amount_roundness", "hour", "is_weekend", "is_night",
    "txn_count_5m", "txn_count_15m", "txn_count_1h", "txn_count_24h",
    "avg_amount_24h", "amount_std_24h", "amount_zscore", "failure_rate_24h",
    "same_country", "distance_km_prev", "minutes_since_last_txn",
    "new_device", "device_count_24h",
]


class FeatureEngine:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def extract_features(self, txn: Transaction) -> dict[str, float]:
        features: dict[str, float] = {}
        now = txn.created_at.replace(tzinfo=timezone.utc) if txn.created_at and txn.created_at.tzinfo is None else txn.created_at or datetime.now(timezone.utc)
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)

        window_5m = await self._count_txns_since(txn, minutes=5)
        window_15m = await self._count_txns_since(txn, minutes=15)
        window_1h = await self._count_txns_since(txn, minutes=60)
        window_24h = await self._count_txns_since(txn, minutes=1440)

        features["amount"] = float(txn.amount)
        features["amount_log"] = float(np.log1p(txn.amount))
        features["amount_roundness"] = 1.0 if txn.amount > 0 and txn.amount == int(txn.amount) else 0.0
        features["hour"] = float(now.hour)
        features["is_weekend"] = 1.0 if now.weekday() >= 5 else 0.0
        features["is_night"] = 1.0 if now.hour < 6 or now.hour >= 23 else 0.0
        features["txn_count_5m"] = float(window_5m)
        features["txn_count_15m"] = float(window_15m)
        features["txn_count_1h"] = float(window_1h)
        features["txn_count_24h"] = float(window_24h)

        stats_24h = await self._amount_stats_24h(txn)
        features["avg_amount_24h"] = float(stats_24h.get("avg", 0.0))
        features["amount_std_24h"] = float(stats_24h.get("std", 0.0))
        avg = stats_24h.get("avg", 0.0) or 1.0
        std = stats_24h.get("std", 0.0) or 1.0
        features["amount_zscore"] = float((txn.amount - avg) / std) if std > 0 else 0.0

        failure_rate = await self._failure_rate_24h(txn)
        features["failure_rate_24h"] = float(failure_rate)

        features["same_country"] = await self._calc_same_country(txn)
        features["distance_km_prev"] = await self._calc_distance_from_prev(txn)
        features["minutes_since_last_txn"] = await self._calc_minutes_since_last(txn, now)
        features["new_device"] = await self._calc_new_device(txn)
        features["device_count_24h"] = await self._calc_device_count_24h(txn)

        return features

    async def _count_txns_since(self, txn: Transaction, minutes: int) -> int:
        from datetime import timedelta
        txn_time = txn.created_at
        if txn_time and txn_time.tzinfo is None:
            cutoff = datetime.now(timezone.utc) - timedelta(minutes=minutes)
        else:
            cutoff = datetime.now(timezone.utc) - timedelta(minutes=minutes)
        result = await self.db.execute(
            select(func.count(Transaction.id)).where(
                Transaction.merchant_id == txn.merchant_id,
                Transaction.created_at >= cutoff,
                Transaction.id != txn.id,
            )
        )
        return result.scalar() or 0

    async def _amount_stats_24h(self, txn: Transaction) -> dict[str, float]:
        from datetime import timedelta
        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
        result = await self.db.execute(
            select(Transaction.amount).where(
                Transaction.merchant_id == txn.merchant_id,
                Transaction.created_at >= cutoff,
                Transaction.id != txn.id,
            )
        )
        amounts = [r[0] or 0.0 for r in result.all()]
        if not amounts:
            return {"avg": 0.0, "std": 0.0}
        avg = sum(amounts) / len(amounts)
        std = (sum((a - avg) ** 2 for a in amounts) / len(amounts)) ** 0.5 if len(amounts) > 1 else 0.0
        return {"avg": avg, "std": std}

    async def _failure_rate_24h(self, txn: Transaction) -> float:
        from datetime import timedelta
        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
        total = await self.db.execute(
            select(func.count(Transaction.id)).where(
                Transaction.merchant_id == txn.merchant_id,
                Transaction.created_at >= cutoff,
            )
        )
        failed = await self.db.execute(
            select(func.count(Transaction.id)).where(
                Transaction.merchant_id == txn.merchant_id,
                Transaction.created_at >= cutoff,
                Transaction.status == TransactionStatus.FAILED,
            )
        )
        t = total.scalar() or 1
        f = failed.scalar() or 0
        return f / t if t > 0 else 0.0

    async def _calc_same_country(self, txn: Transaction) -> float:
        if not txn.customer_id:
            return 0.0
        loc = await self.db.execute(
            select(PaymentLocation).where(PaymentLocation.transaction_id == txn.id)
        )
        loc_row = loc.scalar_one_or_none()
        if not loc_row or not loc_row.country:
            return 0.0
        prev = await self.db.execute(
            select(PaymentLocation).join(Transaction).where(
                Transaction.customer_id == txn.customer_id,
                PaymentLocation.id != loc_row.id,
            ).order_by(PaymentLocation.created_at.desc()).limit(1)
        )
        prev_loc = prev.scalar_one_or_none()
        if prev_loc and prev_loc.country:
            return 1.0 if prev_loc.country == loc_row.country else -1.0
        return 0.0

    async def _calc_distance_from_prev(self, txn: Transaction) -> float:
        loc = await self.db.execute(
            select(PaymentLocation).where(PaymentLocation.transaction_id == txn.id)
        )
        loc_row = loc.scalar_one_or_none()
        if not loc_row:
            return 0.0
        prev = await self.db.execute(
            select(PaymentLocation).join(Transaction).where(
                Transaction.customer_id == txn.customer_id,
                PaymentLocation.id != loc_row.id,
            ).order_by(PaymentLocation.created_at.desc()).limit(1)
        )
        prev_loc = prev.scalar_one_or_none()
        if not prev_loc:
            return 0.0
        return self._haversine(loc_row.latitude, loc_row.longitude, prev_loc.latitude, prev_loc.longitude)

    async def _calc_minutes_since_last(self, txn: Transaction, now: datetime) -> float:
        if not txn.customer_id:
            return 9999.0
        last_txn = await self.db.execute(
            select(Transaction.created_at).where(
                Transaction.customer_id == txn.customer_id,
                Transaction.id != txn.id,
            ).order_by(Transaction.created_at.desc()).limit(1)
        )
        last = last_txn.scalar_one_or_none()
        if not last:
            return 9999.0
        if last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        diff = (now - last).total_seconds() / 60.0
        return float(max(diff, 0.0))

    async def _calc_new_device(self, txn: Transaction) -> float:
        return 0.0

    async def _calc_device_count_24h(self, txn: Transaction) -> float:
        return 0.0

    @staticmethod
    def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c
