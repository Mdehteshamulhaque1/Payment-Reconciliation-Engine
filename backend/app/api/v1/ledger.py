from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.settlement import (
    LedgerBalanceOut,
    LedgerEntryListResponse,
    LedgerEntryOut,
    TrialBalanceResponse,
)
from app.services import ledger_service
from app.models.ledger_entry import LedgerEntryType

router = APIRouter(prefix="/ledger", tags=["Ledger"])


@router.get("/entries", response_model=LedgerEntryListResponse, summary="List ledger entries")
async def list_entries(
    page: int = 1, size: int = 20, account: str | None = None,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
) -> LedgerEntryListResponse:
    items, total = await ledger_service.list_entries(db, page, size, account)
    return LedgerEntryListResponse(items=[LedgerEntryOut.model_validate(e) for e in items], total=total)


@router.get("/balance/{account}", response_model=LedgerBalanceOut, summary="Account balance")
async def balance(account: str, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> LedgerBalanceOut:
    bal = await ledger_service.get_account_balance(db, account)
    return LedgerBalanceOut(account=account, balance=bal, currency="INR", entry_count=0)


@router.get("/transaction/{transaction_id}", response_model=list[LedgerEntryOut], summary="Entries for transaction")
async def txn_entries(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    entries = await ledger_service.get_entries_for_transaction(db, transaction_id)
    return [LedgerEntryOut.model_validate(e) for e in entries]


@router.post("/adjust", summary="Manual ledger adjustment")
async def adjust(
    account: str, transaction_id: int, entry_type: LedgerEntryType, amount: float,
    description: str | None = None, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
):
    entry = await ledger_service.create_entry(db, account, transaction_id, entry_type, amount, description=description)
    return {"id": entry.id, "balance_after": entry.balance_after}


@router.post("/reverse/{entry_id}", summary="Reverse a ledger entry")
async def reverse(entry_id: int, reason: str | None = None, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    entry = await ledger_service.reverse_entry(db, entry_id, reason)
    return {"id": entry.id, "balance_after": entry.balance_after}


@router.get("/trial-balance", response_model=TrialBalanceResponse, summary="Trial balance")
async def trial_balance(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> TrialBalanceResponse:
    data = await ledger_service.get_trial_balance(db)
    return TrialBalanceResponse(**data)
