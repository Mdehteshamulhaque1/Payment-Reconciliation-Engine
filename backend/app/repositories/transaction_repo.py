from sqlalchemy import func, select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.transaction import Transaction, TransactionStatus
from app.models.transaction_event import TransactionEvent


class TransactionRepository(BaseRepository[Transaction]):
    def __init__(self, db: AsyncSession):
        super().__init__(Transaction, db)

    async def get_by_ref(self, ref: str) -> Transaction | None:
        result = await self.db.execute(select(Transaction).where(Transaction.transaction_ref == ref))
        return result.scalar_one_or_none()

    async def get_by_idempotency_key(self, key: str) -> Transaction | None:
        result = await self.db.execute(select(Transaction).where(Transaction.idempotency_key == key))
        return result.scalar_one_or_none()

    async def get_by_gateway_txn_id(self, gateway_txn_id: str) -> Transaction | None:
        result = await self.db.execute(
            select(Transaction).where(Transaction.gateway_transaction_id == gateway_txn_id)
        )
        return result.scalar_one_or_none()

    async def list_filtered(
        self,
        offset: int = 0,
        limit: int = 20,
        status: TransactionStatus | None = None,
        merchant_id: int | None = None,
        gateway_id: int | None = None,
        search: str | None = None,
        currency: str | None = None,
        min_amount: float | None = None,
        max_amount: float | None = None,
    ) -> tuple[list[Transaction], int]:
        query = select(Transaction)
        count_query = select(func.count(Transaction.id))
        filters = []
        if status:
            filters.append(Transaction.status == status)
        if merchant_id:
            filters.append(Transaction.merchant_id == merchant_id)
        if gateway_id:
            filters.append(Transaction.gateway_id == gateway_id)
        if currency:
            filters.append(Transaction.currency == currency)
        if min_amount is not None:
            filters.append(Transaction.amount >= min_amount)
        if max_amount is not None:
            filters.append(Transaction.amount <= max_amount)
        if search:
            search_filter = or_(
                Transaction.transaction_ref.ilike(f"%{search}%"),
                Transaction.description.ilike(f"%{search}%"),
                Transaction.gateway_transaction_id.ilike(f"%{search}%"),
            )
            filters.append(search_filter)

        for f in filters:
            query = query.where(f)
            count_query = count_query.where(f)

        total = (await self.db.execute(count_query)).scalar() or 0
        query = query.order_by(Transaction.created_at.desc(), Transaction.id.desc()).offset(offset).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def get_pending_for_reconciliation(self, batch_size: int = 500) -> list[Transaction]:
        result = await self.db.execute(
            select(Transaction)
            .where(Transaction.status.in_([TransactionStatus.SUCCESS, TransactionStatus.FAILED]))
            .order_by(Transaction.created_at.desc())
            .limit(batch_size)
        )
        return list(result.scalars().all())

    async def get_velocity_count(self, merchant_id: int, window_minutes: int = 60) -> int:
        from datetime import datetime, timedelta, timezone
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=window_minutes)
        query = select(func.count(Transaction.id)).where(
            Transaction.merchant_id == merchant_id,
            Transaction.created_at >= cutoff,
        )
        return (await self.db.execute(query)).scalar() or 0

    async def get_refund_count(self, customer_id: int) -> int:
        query = select(func.count(Transaction.id)).where(
            Transaction.customer_id == customer_id,
            Transaction.status == TransactionStatus.REFUNDED,
        )
        return (await self.db.execute(query)).scalar() or 0

    async def find_duplicates(
        self, amount: float, currency: str, gateway_id: int, within_seconds: int = 300
    ) -> list[Transaction]:
        from datetime import datetime, timedelta, timezone
        cutoff = datetime.now(timezone.utc) - timedelta(seconds=within_seconds)
        result = await self.db.execute(
            select(Transaction).where(
                Transaction.amount == amount,
                Transaction.currency == currency,
                Transaction.gateway_id == gateway_id,
                Transaction.created_at >= cutoff,
            )
        )
        return list(result.scalars().all())

    async def create_event(self, transaction_id: int, from_status: str | None, to_status: str, reason: str | None = None, actor: str | None = None) -> TransactionEvent:
        event = TransactionEvent(
            transaction_id=transaction_id,
            from_status=from_status,
            to_status=to_status,
            reason=reason,
            actor=actor,
        )
        self.db.add(event)
        return event
