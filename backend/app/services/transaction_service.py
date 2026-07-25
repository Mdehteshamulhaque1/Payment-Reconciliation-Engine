import math

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import AlreadyExistsException, BadRequestException, NotFoundException
from app.models.transaction import Transaction, TransactionStatus
from app.models.transaction_event import TransactionEvent


async def create_transaction(db: AsyncSession, data: dict) -> Transaction:
    existing = await db.execute(
        select(Transaction).where(Transaction.transaction_ref == data["transaction_ref"])
    )
    if existing.scalar_one_or_none():
        raise AlreadyExistsException("Transaction", f"Ref {data['transaction_ref']} already exists")

    if data.get("idempotency_key"):
        idem = await db.execute(
            select(Transaction).where(Transaction.idempotency_key == data["idempotency_key"])
        )
        if idem.scalar_one_or_none():
            raise AlreadyExistsException("Transaction", "Duplicate idempotency key")

    transaction = Transaction(**data)
    db.add(transaction)
    await db.flush()

    event = TransactionEvent(
        transaction_id=transaction.id,
        from_status=None,
        to_status=transaction.status.value,
        reason="Transaction created",
        actor="system",
    )
    db.add(event)
    await db.commit()
    await db.refresh(transaction)
    return transaction


async def get_transaction(db: AsyncSession, transaction_id: int) -> Transaction:
    result = await db.execute(
        select(Transaction).where(Transaction.id == transaction_id).options(
            selectinload(Transaction.events),
            selectinload(Transaction.merchant),
            selectinload(Transaction.gateway),
        )
    )
    transaction = result.scalar_one_or_none()
    if not transaction:
        raise NotFoundException("Transaction", transaction_id)
    return transaction


async def get_transaction_by_ref(db: AsyncSession, ref: str) -> Transaction:
    result = await db.execute(select(Transaction).where(Transaction.transaction_ref == ref))
    transaction = result.scalar_one_or_none()
    if not transaction:
        raise NotFoundException("Transaction", ref)
    return transaction


async def list_transactions(
    db: AsyncSession,
    page: int = 1,
    size: int = 20,
    status: TransactionStatus | None = None,
    merchant_id: int | None = None,
    gateway_id: int | None = None,
    search: str | None = None,
) -> tuple[list[Transaction], int]:
    query = select(Transaction)
    count_query = select(func.count(Transaction.id))

    if status:
        query = query.where(Transaction.status == status)
        count_query = count_query.where(Transaction.status == status)
    if merchant_id:
        query = query.where(Transaction.merchant_id == merchant_id)
        count_query = count_query.where(Transaction.merchant_id == merchant_id)
    if gateway_id:
        query = query.where(Transaction.gateway_id == gateway_id)
        count_query = count_query.where(Transaction.gateway_id == gateway_id)
    if search:
        search_filter = Transaction.transaction_ref.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    offset = (page - 1) * size
    query = query.order_by(Transaction.created_at.desc(), Transaction.id.desc()).offset(offset).limit(size)
    result = await db.execute(query)
    return list(result.scalars().all()), total


async def update_transaction_status(
    db: AsyncSession, transaction_id: int, new_status: TransactionStatus, reason: str | None = None, actor: str | None = None
) -> Transaction:
    transaction = await get_transaction(db, transaction_id)
    old_status = transaction.status

    if old_status == new_status:
        raise BadRequestException(f"Transaction is already in {new_status.value} status")

    transaction.status = new_status
    if new_status == TransactionStatus.FAILED and reason:
        transaction.failure_reason = reason

    event = TransactionEvent(
        transaction_id=transaction.id,
        from_status=old_status.value,
        to_status=new_status.value,
        reason=reason,
        actor=actor,
    )
    db.add(event)
    await db.commit()
    await db.refresh(transaction)
    return transaction


async def cancel_transaction(db: AsyncSession, transaction_id: int, reason: str | None = None) -> Transaction:
    transaction = await get_transaction(db, transaction_id)
    if transaction.status in (TransactionStatus.CANCELLED, TransactionStatus.REFUNDED):
        raise BadRequestException(f"Cannot cancel transaction in {transaction.status.value} status")
    return await update_transaction_status(db, transaction_id, TransactionStatus.CANCELLED, reason, "user")


async def refund_transaction(db: AsyncSession, transaction_id: int, reason: str | None = None) -> Transaction:
    transaction = await get_transaction(db, transaction_id)
    if transaction.status != TransactionStatus.SUCCESS:
        raise BadRequestException("Can only refund successful transactions")
    return await update_transaction_status(db, transaction_id, TransactionStatus.REFUNDED, reason, "user")


async def retry_transaction(db: AsyncSession, transaction_id: int) -> Transaction:
    transaction = await get_transaction(db, transaction_id)
    if transaction.status not in (TransactionStatus.FAILED,):
        raise BadRequestException("Can only retry failed transactions")
    transaction.retry_count += 1
    return await update_transaction_status(db, transaction_id, TransactionStatus.PENDING, "Retry initiated", "user")


async def get_transaction_events(db: AsyncSession, transaction_id: int) -> list[TransactionEvent]:
    await get_transaction(db, transaction_id)
    result = await db.execute(
        select(TransactionEvent)
        .where(TransactionEvent.transaction_id == transaction_id)
        .order_by(TransactionEvent.created_at.desc())
    )
    return list(result.scalars().all())


async def get_transaction_stats(db: AsyncSession) -> dict:
    result = await db.execute(select(Transaction))
    transactions = list(result.scalars().all())

    total = len(transactions)
    status_counts = {}
    total_amount = 0.0
    for t in transactions:
        status_counts[t.status.value] = status_counts.get(t.status.value, 0) + 1
        total_amount += t.amount

    return {
        "total": total,
        "pending": status_counts.get("pending", 0) + status_counts.get("created", 0) + status_counts.get("processing", 0),
        "success": status_counts.get("success", 0),
        "failed": status_counts.get("failed", 0),
        "refunded": status_counts.get("refunded", 0),
        "reconciled": status_counts.get("reconciled", 0),
        "total_amount": total_amount,
        "success_rate": round((status_counts.get("success", 0) / total * 100), 2) if total > 0 else 0.0,
    }


async def bulk_create_transactions(db: AsyncSession, items: list[dict]) -> list[Transaction]:
    created = []
    for item in items:
        try:
            txn = await create_transaction(db, item)
            created.append(txn)
        except AlreadyExistsException:
            continue
    return created
