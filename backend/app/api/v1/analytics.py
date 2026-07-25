from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.analytics import DashboardKPIs, GatewayComparison, TopFailure
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=DashboardKPIs, summary="Dashboard KPIs")
async def dashboard(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    data = await analytics_service.get_dashboard(db)
    return DashboardKPIs(**data)


@router.get("/gateway-comparison", response_model=list[GatewayComparison], summary="Gateway comparison")
async def gateway_comparison(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    data = await analytics_service.get_gateway_comparison(db)
    return [GatewayComparison(**d) for d in data]


@router.get("/top-failures", response_model=list[TopFailure], summary="Top failure reasons")
async def top_failures(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    data = await analytics_service.get_top_failures(db)
    return [TopFailure(**d) for d in data]
