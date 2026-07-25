from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.models.exception import ExceptionRecord

router = APIRouter(prefix="/exceptions", tags=["Exceptions"])


@router.get("", summary="List exceptions")
async def list_exceptions(
    page: int = 1, size: int = 20,
    db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user),
):
    count = (await db.execute(select(func.count(ExceptionRecord.id)))).scalar() or 0
    offset = (page - 1) * size
    result = await db.execute(
        select(ExceptionRecord).order_by(ExceptionRecord.occurred_at.desc()).offset(offset).limit(size)
    )
    items = result.scalars().all()
    return {
        "items": [
            {
                "id": e.id, "error_code": e.error_code, "message": e.message,
                "request_path": e.request_path, "occurred_at": str(e.occurred_at),
            }
            for e in items
        ],
        "total": count,
    }
