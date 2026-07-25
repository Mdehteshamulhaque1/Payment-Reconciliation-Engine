from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.rules_fraud import FraudCaseListResponse, FraudCaseOut, FraudDashboard, FraudScanResponse
from app.services import fraud_detector

router = APIRouter(prefix="/fraud", tags=["Fraud Detection"])


@router.post("/scan/{transaction_id}", response_model=FraudScanResponse, summary="Scan transaction for fraud")
async def scan(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    data = await fraud_detector.scan_transaction(db, transaction_id)
    return FraudScanResponse(**data)


@router.get("/cases", response_model=FraudCaseListResponse, summary="List fraud cases")
async def list_cases(
    page: int = 1, size: int = 20, status: str | None = None,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
):
    items, total = await fraud_detector.list_fraud_cases(db, page, size, status)
    return FraudCaseListResponse(items=[FraudCaseOut.model_validate(c) for c in items], total=total)


@router.get("/dashboard", response_model=FraudDashboard, summary="Fraud dashboard")
async def dashboard(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    data = await fraud_detector.get_fraud_dashboard(db)
    return FraudDashboard(**data)


@router.get("/{case_id}", response_model=FraudCaseOut, summary="Fraud case details")
async def get_case(case_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    case = await fraud_detector.get_fraud_case(db, case_id)
    return FraudCaseOut.model_validate(case)


@router.put("/{case_id}/resolve", response_model=FraudCaseOut, summary="Resolve fraud case")
async def resolve(case_id: int, body: dict | None = None, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    status_val = "resolved"
    notes = None
    if body:
        status_val = body.get("status", "resolved")
        notes = body.get("notes")
    case = await fraud_detector.resolve_fraud_case(db, case_id, status_val, notes)
    return FraudCaseOut.model_validate(case)
