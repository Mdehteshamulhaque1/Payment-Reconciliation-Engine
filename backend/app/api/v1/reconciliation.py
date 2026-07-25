import math

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.reconciliation import ReconciliationListResponse, ReconciliationResolveRequest, ReconciliationResultOut, ReconciliationSummary
from app.services import reconciliation_engine

router = APIRouter(prefix="/reconciliation", tags=["Reconciliation"])


@router.post("/run", summary="Run reconciliation")
async def run(body: dict | None = None, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    batch_id = None
    if body:
        batch_id = body.get("batch_id") or body.get("type")
    data = await reconciliation_engine.run_reconciliation(db, batch_id)
    return {"message": "Reconciliation batch completed", **data}


@router.get("/results", response_model=ReconciliationListResponse, summary="List reconciliation results")
async def list_results(
    page: int = 1, size: int = 20, discrepancy_type: str | None = None,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
) -> ReconciliationListResponse:
    items, total = await reconciliation_engine.list_results(db, page, size, discrepancy_type)
    return ReconciliationListResponse(items=[ReconciliationResultOut.model_validate(r) for r in items], total=total)


@router.get("/summary", response_model=ReconciliationSummary, summary="Reconciliation summary")
async def summary(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> ReconciliationSummary:
    data = await reconciliation_engine.get_summary(db)
    return ReconciliationSummary(**data)


@router.get("/mismatches", response_model=ReconciliationListResponse, summary="Get mismatches")
async def mismatches(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    items, total = await reconciliation_engine.list_results(db, discrepancy_type="amount_mismatch")
    return ReconciliationListResponse(items=[ReconciliationResultOut.model_validate(r) for r in items], total=total)


@router.get("/missing", response_model=ReconciliationListResponse, summary="Missing records")
async def missing(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    items, total = await reconciliation_engine.list_results(db, discrepancy_type="missing_internal")
    return ReconciliationListResponse(items=[ReconciliationResultOut.model_validate(r) for r in items], total=total)


@router.get("/duplicates", response_model=ReconciliationListResponse, summary="Duplicate detection")
async def duplicates(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    items, total = await reconciliation_engine.list_results(db, discrepancy_type="duplicate")
    return ReconciliationListResponse(items=[ReconciliationResultOut.model_validate(r) for r in items], total=total)


@router.get("/accuracy", summary="Accuracy metrics")
async def accuracy(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    return await reconciliation_engine.get_summary(db)


@router.get("/{result_id}", response_model=ReconciliationResultOut, summary="Result details")
async def get_one(result_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> ReconciliationResultOut:
    r = await reconciliation_engine.get_result(db, result_id)
    return ReconciliationResultOut.model_validate(r)


@router.post("/{result_id}/resolve", response_model=ReconciliationResultOut, summary="Resolve discrepancy")
async def resolve(result_id: int, payload: ReconciliationResolveRequest, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    r = await reconciliation_engine.resolve_result(db, result_id, payload.resolved_by)
    return ReconciliationResultOut.model_validate(r)
