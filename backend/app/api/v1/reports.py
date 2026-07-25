import math

from fastapi import APIRouter, Depends, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.reports_search import ReportCreateRequest, ReportListResponse, ReportOut
from app.services import reporting_service

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("", response_model=ReportListResponse, summary="List reports")
async def list_reports(
    page: int = 1, size: int = 20,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
):
    items, total = await reporting_service.list_reports(db, page, size)
    return ReportListResponse(items=[ReportOut.model_validate(r) for r in items], total=total)


@router.post("", response_model=ReportOut, status_code=201, summary="Create report")
async def create(payload: ReportCreateRequest, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    report = await reporting_service.create_report(db, payload.model_dump())
    return ReportOut.model_validate(report)


@router.get("/{report_id}", response_model=ReportOut, summary="Report details")
async def get_one(report_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    report = await reporting_service.get_report(db, report_id)
    return ReportOut.model_validate(report)


@router.post("/{report_id}/generate", summary="Generate report CSV")
async def generate(report_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    filepath = await reporting_service.generate_csv_report(db, report_id)
    return {"file_path": filepath, "status": "completed"}


@router.get("/{report_id}/download", summary="Download report file")
async def download(report_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    report = await reporting_service.get_report(db, report_id)
    if not report.file_path:
        return {"error": "Report not generated yet"}
    return FileResponse(report.file_path, filename=f"{report.name}.{report.format}")
