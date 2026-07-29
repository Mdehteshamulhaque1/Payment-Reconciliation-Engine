import json
from datetime import datetime, timedelta, timezone
from typing import Any

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.behavioral_profile import BehavioralProfile
from app.models.transaction import Transaction, TransactionStatus
from app.models.payment_location import PaymentLocation

logger = structlog.get_logger("services.ml.behavioral_analytics")


class BehavioralAnalyzer:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def analyze(self, txn: Transaction) -> dict[str, Any]:
        if not txn.customer_id:
            return {"behavioral_risk": 0.0, "anomalies": []}

        profile = await self._get_or_create_profile("customer", txn.customer_id)
        anomalies = []
        total_risk = 0.0

        if profile.avg_amount > 0:
            if txn.amount > profile.avg_amount + 3 * profile.std_amount:
                severity = min(1.0, (txn.amount - profile.avg_amount) / (profile.avg_amount * 5))
                anomalies.append({"type": "amount_anomaly", "detail": f"Amount {txn.amount} exceeds avg {profile.avg_amount:.2f} by >3 std", "risk": round(severity, 4)})
                total_risk = max(total_risk, severity)

        if profile.avg_amount > 0 and profile.avg_amount_30d > 0:
            ratio = txn.amount / profile.avg_amount_30d if profile.avg_amount_30d > 0 else 0
            if ratio > 5:
                anomalies.append({"type": "amount_surge", "detail": f"Amount {txn.amount} is {ratio:.1f}x the 30d avg", "risk": 0.5})
                total_risk = max(total_risk, 0.5)

        hour = txn.created_at.hour if txn.created_at else 0
        if profile.preferred_hour_start is not None and profile.preferred_hour_end is not None:
            if not (profile.preferred_hour_start <= hour <= profile.preferred_hour_end):
                anomalies.append({"type": "unusual_hour", "detail": f"Txn at hour {hour}, preferred {profile.preferred_hour_start}-{profile.preferred_hour_end}", "risk": 0.3})
                total_risk = max(total_risk, 0.3)

        if profile.txn_count_24h > 0 and profile.txn_count_7d > 0:
            daily_avg = profile.txn_count_7d / 7.0 if profile.txn_count_7d > 0 else 0
            if daily_avg > 0 and profile.txn_count_24h > daily_avg * 3:
                anomalies.append({"type": "frequency_surge", "detail": f"24h count {profile.txn_count_24h} is {profile.txn_count_24h/daily_avg:.1f}x daily avg", "risk": 0.4})
                total_risk = max(total_risk, 0.4)

        loc = await self.db.execute(
            select(PaymentLocation).where(PaymentLocation.transaction_id == txn.id)
        )
        loc_row = loc.scalar_one_or_none()
        if loc_row and loc_row.country and profile.common_countries:
            common = json.loads(profile.common_countries) if isinstance(profile.common_countries, str) else []
            if common and loc_row.country not in common:
                anomalies.append({"type": "new_country", "detail": f"Transaction from new country: {loc_row.country}", "risk": 0.35})
                total_risk = max(total_risk, 0.35)

        if profile.failure_rate > 0.3 and txn.amount > profile.avg_amount:
            anomalies.append({"type": "high_failure_rate", "detail": f"Customer failure rate is {profile.failure_rate:.0%}", "risk": 0.25})
            total_risk = max(total_risk, 0.25)

        await self._update_profile(profile, txn, loc_row)

        return {"behavioral_risk": round(total_risk, 4), "anomalies": anomalies}

    async def _get_or_create_profile(self, entity_type: str, entity_id: int) -> BehavioralProfile:
        result = await self.db.execute(
            select(BehavioralProfile).where(
                BehavioralProfile.entity_type == entity_type,
                BehavioralProfile.entity_id == entity_id,
            )
        )
        profile = result.scalar_one_or_none()
        if not profile:
            profile = BehavioralProfile(entity_type=entity_type, entity_id=entity_id)
            self.db.add(profile)
            await self.db.commit()
            await self.db.refresh(profile)
        return profile

    async def _update_profile(self, profile: BehavioralProfile, txn: Transaction, loc_row: PaymentLocation | None):
        now = datetime.now(timezone.utc)
        cutoff_30d = now - timedelta(days=30)
        cutoff_7d = now - timedelta(days=7)
        cutoff_24h = now - timedelta(hours=24)

        all_txns = await self.db.execute(
            select(Transaction).where(
                Transaction.customer_id == txn.customer_id,
            ).order_by(Transaction.created_at.desc()).limit(1000)
        )
        txns = list(all_txns.scalars().all())
        recent_30d = [t for t in txns if t.created_at and t.created_at.replace(tzinfo=timezone.utc) >= cutoff_30d] if txns else []
        recent_7d = [t for t in recent_30d if t.created_at and t.created_at.replace(tzinfo=timezone.utc) >= cutoff_7d] if recent_30d else []
        recent_24h = [t for t in recent_7d if t.created_at and t.created_at.replace(tzinfo=timezone.utc) >= cutoff_24h] if recent_7d else []

        if txns:
            amounts = [t.amount for t in txns]
            profile.avg_amount = sum(amounts) / len(amounts)
            profile.std_amount = (sum((a - profile.avg_amount) ** 2 for a in amounts) / len(amounts)) ** 0.5 if len(amounts) > 1 else 0.0
            profile.txn_count_total = len(txns)
            profile.last_txn_at = max(t.created_at for t in txns if t.created_at)

        if recent_30d:
            profile.avg_amount_30d = sum(t.amount for t in recent_30d) / len(recent_30d)
            profile.txn_count_30d = len(recent_30d)
        if recent_7d:
            profile.avg_amount_7d = sum(t.amount for t in recent_7d) / len(recent_7d)
            profile.txn_count_7d = len(recent_7d)
        profile.txn_count_24h = len(recent_24h)

        failed = sum(1 for t in txns if t.status == TransactionStatus.FAILED) if txns else 0
        profile.failure_rate = failed / len(txns) if txns else 0.0

        if len(txns) >= 2:
            intervals = []
            sorted_txns = sorted(txns, key=lambda t: t.created_at or datetime.min)
            for i in range(1, len(sorted_txns)):
                t1 = sorted_txns[i - 1].created_at
                t2 = sorted_txns[i].created_at
                if t1 and t2:
                    intervals.append((t2 - t1).total_seconds() / 60.0)
            if intervals:
                profile.avg_txn_interval_minutes = sum(intervals) / len(intervals)

        if loc_row and loc_row.country:
            countries = json.loads(profile.common_countries) if profile.common_countries else []
            if loc_row.country not in countries:
                countries.append(loc_row.country)
            profile.common_countries = json.dumps(countries[:20])

        if loc_row and loc_row.city:
            cities = json.loads(profile.common_cities) if profile.common_cities else []
            if loc_row.city not in cities:
                cities.append(loc_row.city)
            profile.common_cities = json.dumps(cities[:20])

        if txns:
            hours = [t.created_at.hour for t in txns if t.created_at]
            if hours:
                profile.preferred_hour_start = max(0, int(sum(hours) / len(hours)) - 3)
                profile.preferred_hour_end = min(23, int(sum(hours) / len(hours)) + 3)

        await self.db.commit()
