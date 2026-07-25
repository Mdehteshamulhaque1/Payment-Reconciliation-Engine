import math

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.models.audit_log import AuditLog
from app.schemas.reports_search import AuditLogListResponse, AuditLogOut

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get("", response_model=AuditLogListResponse, summary="Audit log entries")
async def list_audit(
    page: int = 1, size: int = 20, action: str | None = None, resource: str | None = None,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
):
    query = select(AuditLog)
    count_query = select(func.count(AuditLog.id))

    if action:
        query = query.where(AuditLog.action == action)
        count_query = count_query.where(AuditLog.action == action)
    if resource:
        query = query.where(AuditLog.resource == resource)
        count_query = count_query.where(AuditLog.resource == resource)

    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * size
    result = await db.execute(query.order_by(AuditLog.created_at.desc()).offset(offset).limit(size))
    items = result.scalars().all()

    return AuditLogListResponse(items=[AuditLogOut.model_validate(a) for a in items], total=total)


@router.get("/user/{user_id}", response_model=AuditLogListResponse, summary="User audit trail")
async def user_audit(user_id: int, page: int = 1, size: int = 20, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    count_query = select(func.count(AuditLog.id)).where(AuditLog.user_id == user_id)
    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * size
    result = await db.execute(
        select(AuditLog).where(AuditLog.user_id == user_id).order_by(AuditLog.created_at.desc()).offset(offset).limit(size)
    )
    items = result.scalars().all()
    return AuditLogListResponse(items=[AuditLogOut.model_validate(a) for a in items], total=total)
