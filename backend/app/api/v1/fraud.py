from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.rules_fraud import (
    FraudCaseListResponse, FraudCaseOut, FraudCaseDetailResponse,
    FraudDashboard, FraudScanResponse,
    FraudAlertOut, FraudAlertListResponse,
    MLDashboardOut, DeviceIdentifyResponse,
    AssignCaseRequest, EscalateCaseRequest, ResolveCaseRequest,
    MessageResponse,
)
from app.services import fraud_detector

router = APIRouter(prefix="/fraud", tags=["Fraud Detection"])


@router.post("/scan/{transaction_id}", response_model=FraudScanResponse, summary="Scan transaction for fraud (rule + ML)")
async def scan(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    data = await fraud_detector.scan_transaction(db, transaction_id)
    return FraudScanResponse(**data)


@router.get("/cases", response_model=FraudCaseListResponse, summary="List fraud cases")
async def list_cases(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    status: str | None = None, fraud_type: str | None = None,
    min_score: float | None = None,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
):
    items, total = await fraud_detector.list_fraud_cases(db, page, size, status, fraud_type, min_score)
    return FraudCaseListResponse(items=[FraudCaseOut.model_validate(c) for c in items], total=total)


@router.get("/dashboard", response_model=FraudDashboard, summary="Fraud dashboard")
async def dashboard(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    data = await fraud_detector.get_fraud_dashboard(db)
    return FraudDashboard(**data)


@router.get("/ml-dashboard", response_model=MLDashboardOut, summary="ML fraud dashboard")
async def ml_dashboard(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    data = await fraud_detector.get_ml_dashboard(db)
    return MLDashboardOut(**data)


@router.get("/alerts", response_model=FraudAlertListResponse, summary="List fraud alerts")
async def list_alerts(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    severity: str | None = None, status: str | None = None,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
):
    items, total = await fraud_detector.get_alerts(db, page, size, severity, status)
    return FraudAlertListResponse(items=[FraudAlertOut.model_validate(a) for a in items], total=total)


@router.put("/alerts/{alert_id}/acknowledge", response_model=FraudAlertOut, summary="Acknowledge alert")
async def acknowledge_alert(alert_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    alert = await fraud_detector.acknowledge_alert(db, alert_id)
    return FraudAlertOut.model_validate(alert)


@router.get("/{case_id}", response_model=FraudCaseDetailResponse, summary="Fraud case details")
async def get_case(case_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    case = await fraud_detector.get_fraud_case(db, case_id)
    extra = {}
    if case.evidence_json:
        import json
        try:
            evidence = json.loads(case.evidence_json)
            extra["features"] = evidence.get("features")
        except (json.JSONDecodeError, TypeError):
            pass
    if case.shap_explanation:
        import json
        try:
            shap = json.loads(case.shap_explanation)
            extra["shap_top_factors"] = shap.get("top_factors")
        except (json.JSONDecodeError, TypeError):
            pass
    if case.model_contributions:
        import json
        try:
            extra["model_scores"] = {c["model"]: c["score"] for c in json.loads(case.model_contributions)}
        except (json.JSONDecodeError, TypeError, KeyError):
            pass
    base = FraudCaseOut.model_validate(case)
    return FraudCaseDetailResponse(**base.model_dump(), **extra)


@router.put("/{case_id}/resolve", response_model=FraudCaseOut, summary="Resolve fraud case")
async def resolve(case_id: int, body: ResolveCaseRequest | None = None, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    status_val = body.status if body else "resolved"
    notes = body.notes if body else None
    resolution = body.resolution if body else None
    case = await fraud_detector.resolve_fraud_case(db, case_id, status_val, notes, resolution)
    return FraudCaseOut.model_validate(case)


@router.put("/{case_id}/assign", response_model=FraudCaseOut, summary="Assign fraud case")
async def assign(case_id: int, body: AssignCaseRequest, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    case = await fraud_detector.assign_fraud_case(db, case_id, body.assigned_to)
    return FraudCaseOut.model_validate(case)


@router.put("/{case_id}/escalate", response_model=FraudCaseOut, summary="Escalate fraud case")
async def escalate(case_id: int, body: EscalateCaseRequest, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    case = await fraud_detector.escalate_fraud_case(db, case_id, body.escalated_to)
    return FraudCaseOut.model_validate(case)


@router.post("/identify-device", response_model=DeviceIdentifyResponse, summary="Identify device fingerprint")
async def identify_device(body: dict, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    from app.services.ml.device_fingerprint import DeviceFingerprinter
    fingerprinter = DeviceFingerprinter(db)
    result = await fingerprinter.identify(body)
    return DeviceIdentifyResponse(**result)


@router.post("/retrain", response_model=MessageResponse, summary="Retrain ML models")
async def retrain_models(_user=Depends(get_current_active_user)):
    from app.services.ml.ml_models import MLModelRegistry
    registry = MLModelRegistry.get_instance()
    registry.initialized = False
    registry.initialize()
    return MessageResponse(message="ML models retrained successfully")
