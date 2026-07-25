from datetime import datetime, timedelta, timezone
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.fraud_case import FraudCase, FraudCaseStatus


class FraudCaseRepository(BaseRepository[FraudCase]):
    def __init__(self, db: AsyncSession):
        super().__init__(FraudCase, db)

    async def get_by_transaction(self, transaction_id: int) -> FraudCase | None:
        result = await self.db.execute(
            select(FraudCase).where(FraudCase.transaction_id == transaction_id)
        )
        return result.scalar_one_or_none()

    async def list_filtered(
        self,
        offset: int = 0,
        limit: int = 20,
        status: str | None = None,
        fraud_type: str | None = None,
        min_score: float | None = None,
    ) -> tuple[list[FraudCase], int]:
        query = select(FraudCase)
        count_query = select(func.count(FraudCase.id))
        filters = []
        if status:
            filters.append(FraudCase.status == status)
        if fraud_type:
            filters.append(FraudCase.fraud_type == fraud_type)
        if min_score is not None:
            filters.append(FraudCase.risk_score >= min_score)

        for f in filters:
            query = query.where(f)
            count_query = count_query.where(f)

        total = (await self.db.execute(count_query)).scalar() or 0
        query = query.order_by(FraudCase.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def get_open_count(self) -> int:
        return (await self.db.execute(
            select(func.count(FraudCase.id)).where(FraudCase.status == FraudCaseStatus.OPEN)
        )).scalar() or 0

    async def get_dashboard(self) -> dict:
        all_cases = (await self.db.execute(select(FraudCase))).scalars().all()
        total = len(all_cases)
        open_cases = sum(1 for c in all_cases if c.status == FraudCaseStatus.OPEN)
        investigating = sum(1 for c in all_cases if c.status == "investigating")
        confirmed = sum(1 for c in all_cases if c.status == FraudCaseStatus.CONFIRMED)
        fp = sum(1 for c in all_cases if c.status == FraudCaseStatus.FALSE_POSITIVE)
        resolved = sum(1 for c in all_cases if c.status == FraudCaseStatus.RESOLVED)
        avg_score = sum(c.risk_score for c in all_cases) / total if total else 0.0
        critical = sum(1 for c in all_cases if c.risk_score >= 0.8)
        high = sum(1 for c in all_cases if 0.6 <= c.risk_score < 0.8)
        medium = sum(1 for c in all_cases if 0.4 <= c.risk_score < 0.6)
        low = sum(1 for c in all_cases if c.risk_score < 0.4)

        last_24h = datetime.now(timezone.utc) - timedelta(hours=24)
        last_24h_naive = last_24h.replace(tzinfo=None)
        recent_count = sum(
            1 for c in all_cases
            if c.created_at and c.created_at.replace(tzinfo=None) >= last_24h_naive
        )

        return {
            "total_cases": total,
            "open_cases": open_cases,
            "investigating": investigating,
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
            "resolved": resolved + fp,
            "confirmed_fraud": confirmed,
            "false_positives": fp,
            "avg_risk_score": round(float(avg_score), 2),
            "cases_last_24h": recent_count,
        }
