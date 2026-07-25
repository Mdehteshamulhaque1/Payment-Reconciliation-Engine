from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.settlement import Settlement, SettlementStatus
from app.models.bank_record import BankRecord
from app.models.transaction import Transaction, TransactionStatus
from datetime import datetime, timezone


async def create_settlement(db: AsyncSession, transaction_id: int, gateway_id: int | None = None) -> Settlement:
    result = await db.execute(select(Transaction).where(Transaction.id == transaction_id))
    txn = result.scalar_one_or_none()
    if not txn:
        raise NotFoundException("Transaction", transaction_id)

    fee = round(txn.amount * 0.02, 2)
    settlement = Settlement(
        transaction_id=txn.id,
        gateway_id=gateway_id or txn.gateway_id,
        amount=txn.amount,
        currency=txn.currency,
        status=SettlementStatus.PENDING,
        fee=fee,
        net_amount=round(txn.amount - fee, 2),
    )
    db.add(settlement)
    await db.commit()
    await db.refresh(settlement)
    return settlement


async def list_settlements(db: AsyncSession, page: int = 1, size: int = 20, status: str | None = None) -> tuple[list[Settlement], int]:
    query = select(Settlement)
    count_query = select(func.count(Settlement.id))

    if status:
        query = query.where(Settlement.status == status)
        count_query = count_query.where(Settlement.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * size
    query = query.order_by(Settlement.created_at.desc()).offset(offset).limit(size)
    result = await db.execute(query)
    return list(result.scalars().all()), total


async def get_settlement(db: AsyncSession, settlement_id: int) -> Settlement:
    result = await db.execute(select(Settlement).where(Settlement.id == settlement_id))
    settlement = result.scalar_one_or_none()
    if not settlement:
        raise NotFoundException("Settlement", settlement_id)
    return settlement


async def process_pending_settlements(db: AsyncSession) -> int:
    result = await db.execute(
        select(Settlement).where(Settlement.status == SettlementStatus.PENDING)
    )
    settlements = result.scalars().all()
    count = 0
    for s in settlements:
        s.status = SettlementStatus.SETTLED
        s.settlement_date = datetime.now(timezone.utc)
        count += 1
    await db.commit()
    return count


async def get_settlement_summary(db: AsyncSession) -> dict:
    all_result = await db.execute(select(Settlement))
    settlements = list(all_result.scalars().all())

    total = len(settlements)
    settled = sum(1 for s in settlements if s.status == SettlementStatus.SETTLED)
    pending = sum(1 for s in settlements if s.status == SettlementStatus.PENDING)
    failed = sum(1 for s in settlements if s.status == SettlementStatus.FAILED)
    total_amount = sum(s.amount for s in settlements)
    total_settled = sum(s.net_amount for s in settlements if s.status == SettlementStatus.SETTLED)
    total_fees = sum(s.fee for s in settlements)

    return {
        "total": total, "count": total, "pending": pending, "pending_count": pending,
        "settled": settled, "failed": failed, "disputed_count": failed,
        "total_amount": total_amount, "total_settled": total_settled, "total_fees": total_fees,
    }


async def list_bank_records(db: AsyncSession, page: int = 1, size: int = 20) -> tuple[list[BankRecord], int]:
    count_query = select(func.count(BankRecord.id))
    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * size
    result = await db.execute(select(BankRecord).order_by(BankRecord.created_at.desc()).offset(offset).limit(size))
    return list(result.scalars().all()), total


async def match_bank_records(db: AsyncSession) -> int:
    result = await db.execute(
        select(BankRecord).where(BankRecord.is_reconciled == False)
    )
    unmatched = result.scalars().all()
    count = 0
    for record in unmatched:
        settlement_result = await db.execute(
            select(Settlement).where(
                Settlement.bank_ref == record.bank_ref,
                Settlement.amount == record.amount,
            )
        )
        settlement = settlement_result.scalar_one_or_none()
        if settlement:
            record.settlement_id = settlement.id
            record.is_reconciled = True
            count += 1
    await db.commit()
    return count
