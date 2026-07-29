import math

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db, PaginationParams
from app.models.transaction import TransactionStatus
from app.schemas.payment_location import PaymentLocationOut, PaymentLocationResponse
from app.schemas.transaction import (
    TransactionCreate,
    TransactionEventOut,
    TransactionListResponse,
    TransactionOut,
    TransactionRefundRequest,
    TransactionStats,
    TransactionStatusUpdate,
)
from app.services import transaction_service

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED, summary="Create transaction")
async def create(payload: TransactionCreate, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> TransactionOut:
    txn = await transaction_service.create_transaction(db, payload.model_dump())
    return TransactionOut.model_validate(txn)


@router.get("", response_model=TransactionListResponse, summary="List transactions with filters")
async def list_transactions(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    status_filter: TransactionStatus | None = Query(default=None, alias="status"),
    merchant_id: int | None = None,
    gateway_id: int | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    _user=Depends(get_current_active_user),
) -> TransactionListResponse:
    items, total = await transaction_service.list_transactions(db, page, size, status_filter, merchant_id, gateway_id, search)
    pages = math.ceil(total / size) if size > 0 else 0
    return TransactionListResponse(
        items=[TransactionOut.model_validate(t) for t in items],
        total=total,
        page=page,
        size=size,
        pages=pages,
    )


@router.get("/stats", response_model=TransactionStats, summary="Transaction statistics")
async def stats(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> TransactionStats:
    data = await transaction_service.get_transaction_stats(db)
    return TransactionStats(**data)


@router.get("/{transaction_id}", response_model=TransactionOut, summary="Get transaction by ID")
async def get_one(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> TransactionOut:
    txn = await transaction_service.get_transaction(db, transaction_id)
    return TransactionOut.model_validate(txn)


@router.get("/ref/{ref}", response_model=TransactionOut, summary="Get transaction by reference")
async def get_by_ref(ref: str, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> TransactionOut:
    txn = await transaction_service.get_transaction_by_ref(db, ref)
    return TransactionOut.model_validate(txn)


@router.put("/{transaction_id}/status", response_model=TransactionOut, summary="Update transaction status")
async def update_status(
    transaction_id: int,
    payload: TransactionStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _user=Depends(get_current_active_user),
) -> TransactionOut:
    txn = await transaction_service.update_transaction_status(db, transaction_id, payload.status, payload.reason, payload.actor)
    return TransactionOut.model_validate(txn)


@router.post("/{transaction_id}/cancel", response_model=TransactionOut, summary="Cancel transaction")
async def cancel(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> TransactionOut:
    txn = await transaction_service.cancel_transaction(db, transaction_id)
    return TransactionOut.model_validate(txn)


@router.post("/{transaction_id}/refund", response_model=TransactionOut, summary="Refund transaction")
async def refund(
    transaction_id: int,
    payload: TransactionRefundRequest | None = None,
    db: AsyncSession = Depends(get_db),
    _user=Depends(get_current_active_user),
) -> TransactionOut:
    reason = payload.reason if payload else None
    txn = await transaction_service.refund_transaction(db, transaction_id, reason)
    return TransactionOut.model_validate(txn)


@router.post("/{transaction_id}/retry", response_model=TransactionOut, summary="Retry failed transaction")
async def retry(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> TransactionOut:
    txn = await transaction_service.retry_transaction(db, transaction_id)
    return TransactionOut.model_validate(txn)


@router.get("/{transaction_id}/events", response_model=list[TransactionEventOut], summary="Get transaction event history")
async def events(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    evts = await transaction_service.get_transaction_events(db, transaction_id)
    return [TransactionEventOut.model_validate(e) for e in evts]


@router.get("/{transaction_id}/location", response_model=PaymentLocationResponse | None, summary="Get payment location for a transaction")
async def get_location(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    txn = await transaction_service.get_transaction(db, transaction_id)
    if not txn.location:
        return None
    loc = txn.location
    return PaymentLocationResponse(
        transaction_id=txn.transaction_ref,
        amount=txn.amount,
        sender=getattr(txn.merchant, "name", None) if txn.merchant else None,
        receiver=getattr(txn.customer, "name", None) if txn.customer else None,
        payment_time=txn.created_at,
        location=PaymentLocationOut.model_validate(loc),
    )
