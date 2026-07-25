from app.repositories.base import BaseRepository
from app.models.settlement import Settlement
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


class SettlementRepository(BaseRepository[Settlement]):
    def __init__(self, db: AsyncSession):
        super().__init__(Settlement, db)

    async def get_by_transaction(self, transaction_id: int) -> Settlement | None:
        result = await self.db.execute(
            select(Settlement).where(Settlement.transaction_id == transaction_id)
        )
        return result.scalar_one_or_none()

    async def list_filtered(
        self,
        offset: int = 0,
        limit: int = 20,
        status: str | None = None,
        gateway_id: int | None = None,
    ) -> tuple[list[Settlement], int]:
        query = select(Settlement)
        count_query = select(func.count(Settlement.id))
        if status:
            query = query.where(Settlement.status == status)
            count_query = count_query.where(Settlement.status == status)
        if gateway_id:
            query = query.where(Settlement.gateway_id == gateway_id)
            count_query = count_query.where(Settlement.gateway_id == gateway_id)

        total = (await self.db.execute(count_query)).scalar() or 0
        query = query.order_by(Settlement.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def get_pending(self) -> list[Settlement]:
        from app.models.settlement import SettlementStatus
        result = await self.db.execute(
            select(Settlement).where(Settlement.status == SettlementStatus.PENDING)
        )
        return list(result.scalars().all())

    async def get_summary(self) -> dict:
        all_settlements = (await self.db.execute(select(Settlement))).scalars().all()
        total = len(all_settlements)
        total_amount = sum(s.amount for s in all_settlements)
        total_net = sum(s.net_amount or 0 for s in all_settlements)
        total_fees = sum(s.fee or 0 for s in all_settlements)
        pending = sum(1 for s in all_settlements if s.status == "pending")
        settled = sum(1 for s in all_settlements if s.status == "settled")
        failed = sum(1 for s in all_settlements if s.status == "failed")
        delayed = sum(1 for s in all_settlements if s.status == "delayed")
        return {
            "total": total,
            "total_amount": round(total_amount, 2),
            "total_net_amount": round(total_net, 2),
            "total_fees": round(total_fees, 2),
            "pending": pending,
            "settled": settled,
            "failed": failed,
            "delayed": delayed,
        }
