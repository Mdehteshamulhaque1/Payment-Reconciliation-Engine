from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.ledger_entry import LedgerEntry, LedgerEntryType


async def get_account_balance(db: AsyncSession, account: str) -> float:
    result = await db.execute(
        select(LedgerEntry).where(LedgerEntry.account == account).order_by(LedgerEntry.id.desc()).limit(1)
    )
    entry = result.scalar_one_or_none()
    return entry.balance_after if entry else 0.0


async def create_entry(
    db: AsyncSession,
    account: str,
    transaction_id: int,
    entry_type: LedgerEntryType,
    amount: float,
    currency: str = "INR",
    description: str | None = None,
    reference: str | None = None,
) -> LedgerEntry:
    current_balance = await get_account_balance(db, account)

    if entry_type == LedgerEntryType.DEBIT:
        new_balance = current_balance - amount
    else:
        new_balance = current_balance + amount

    entry = LedgerEntry(
        account=account,
        transaction_id=transaction_id,
        entry_type=entry_type,
        amount=amount,
        currency=currency,
        balance_after=new_balance,
        description=description,
        reference=reference,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def reverse_entry(db: AsyncSession, entry_id: int, reason: str | None = None) -> LedgerEntry:
    result = await db.execute(select(LedgerEntry).where(LedgerEntry.id == entry_id))
    original = result.scalar_one_or_none()
    if not original:
        raise NotFoundException("LedgerEntry", entry_id)

    reverse_type = LedgerEntryType.CREDIT if original.entry_type == LedgerEntryType.DEBIT else LedgerEntryType.DEBIT
    return await create_entry(
        db,
        account=original.account,
        transaction_id=original.transaction_id,
        entry_type=reverse_type,
        amount=original.amount,
        currency=original.currency,
        description=reason or f"Reversal of entry #{original.id}",
        reference=f"REV-{original.id}",
    )


async def get_entries_for_transaction(db: AsyncSession, transaction_id: int) -> list[LedgerEntry]:
    result = await db.execute(
        select(LedgerEntry).where(LedgerEntry.transaction_id == transaction_id).order_by(LedgerEntry.created_at)
    )
    return list(result.scalars().all())


async def list_entries(db: AsyncSession, page: int = 1, size: int = 20, account: str | None = None) -> tuple[list[LedgerEntry], int]:
    query = select(LedgerEntry)
    count_query = select(func.count(LedgerEntry.id))

    if account:
        query = query.where(LedgerEntry.account == account)
        count_query = count_query.where(LedgerEntry.account == account)

    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * size
    query = query.order_by(LedgerEntry.created_at.desc()).offset(offset).limit(size)
    result = await db.execute(query)
    return list(result.scalars().all()), total


async def get_trial_balance(db: AsyncSession) -> dict:
    result = await db.execute(select(LedgerEntry))
    entries = list(result.scalars().all())

    accounts: dict[str, dict] = {}
    for e in entries:
        if e.account not in accounts:
            accounts[e.account] = {"total_debit": 0.0, "total_credit": 0.0}
        if e.entry_type == LedgerEntryType.DEBIT:
            accounts[e.account]["total_debit"] += e.amount
        else:
            accounts[e.account]["total_credit"] += e.amount

    trial_entries = []
    for account, totals in accounts.items():
        trial_entries.append({
            "account": account,
            "total_debit": round(totals["total_debit"], 2),
            "total_credit": round(totals["total_credit"], 2),
            "balance": round(totals["total_credit"] - totals["total_debit"], 2),
        })

    total_debit = sum(e["total_debit"] for e in trial_entries)
    total_credit = sum(e["total_credit"] for e in trial_entries)

    return {
        "entries": trial_entries,
        "total_debit": round(total_debit, 2),
        "total_debits": round(total_debit, 2),
        "total_credit": round(total_credit, 2),
        "total_credits": round(total_credit, 2),
        "is_balanced": abs(total_debit - total_credit) < 0.01,
    }
