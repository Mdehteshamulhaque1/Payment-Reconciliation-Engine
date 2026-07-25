import math

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.settlement import (
    BankRecordOut,
    LedgerBalanceOut,
    LedgerEntryListResponse,
    LedgerEntryOut,
    SettlementListResponse,
    SettlementOut,
    SettlementSummary,
    TrialBalanceResponse,
)
from app.services import settlement_service, ledger_service
from app.models.ledger_entry import LedgerEntryType

router = APIRouter(prefix="/settlements", tags=["Settlements"])


@router.get("", response_model=SettlementListResponse, summary="List settlements")
async def list_settlements(
    page: int = 1, size: int = 20, status: str | None = None,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
) -> SettlementListResponse:
    items, total = await settlement_service.list_settlements(db, page, size, status)
    validated = [SettlementOut.model_validate(s) for s in items]
    return SettlementListResponse(items=validated, settlements=validated, total=total)


@router.get("/summary", response_model=SettlementSummary, summary="Settlement summary")
async def summary(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> SettlementSummary:
    data = await settlement_service.get_settlement_summary(db)
    return SettlementSummary(**data)


@router.get("/bank-records", response_model=list[BankRecordOut], summary="Bank records")
async def bank_records(page: int = 1, size: int = 20, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    items, _ = await settlement_service.list_bank_records(db, page, size)
    return [BankRecordOut.model_validate(b) for b in items]


@router.post("/process", summary="Process pending settlements")
async def process(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    count = await settlement_service.process_pending_settlements(db)
    return {"processed": count}


@router.post("/match-bank", summary="Match bank records to settlements")
async def match_bank(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    count = await settlement_service.match_bank_records(db)
    return {"matched": count}


@router.get("/{settlement_id}", response_model=SettlementOut, summary="Get settlement details")
async def get_one(settlement_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> SettlementOut:
    s = await settlement_service.get_settlement(db, settlement_id)
    return SettlementOut.model_validate(s)
