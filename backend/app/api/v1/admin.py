from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db, require_superuser
from app.models.user import User
from app.schemas.reports_search import AdminUserOut
from app.services import auth_service, gateway_service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", summary="List all users")
async def list_users(
    page: int = 1, size: int = 20,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_superuser),
):
    count = (await db.execute(select(func.count(User.id)))).scalar() or 0
    offset = (page - 1) * size
    result = await db.execute(select(User).order_by(User.created_at.desc()).offset(offset).limit(size))
    users = result.scalars().all()
    return {
        "items": [AdminUserOut.model_validate(u) for u in users],
        "total": count,
    }


@router.put("/users/{user_id}", summary="Update user (admin)")
async def update_user(
    user_id: int, payload: dict,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_superuser),
):
    return await auth_service.update_user_profile(db, user_id, payload)


@router.get("/stats", summary="System stats")
async def system_stats(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_superuser),
):
    from app.models.transaction import Transaction
    from app.models.settlement import Settlement
    from app.models.reconciliation_result import ReconciliationResult

    return {
        "total_users": (await db.execute(select(func.count(User.id)))).scalar() or 0,
        "total_transactions": (await db.execute(select(func.count(Transaction.id)))).scalar() or 0,
        "total_settlements": (await db.execute(select(func.count(Settlement.id)))).scalar() or 0,
        "total_reconciliations": (await db.execute(select(func.count(ReconciliationResult.id)))).scalar() or 0,
    }


@router.post("/seed", summary="Seed demo data")
async def seed(db: AsyncSession = Depends(get_db), _admin: User = Depends(require_superuser)):
    await gateway_service.ensure_seed_gateways(db)
    return {"message": "Demo data seeded successfully"}
