from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.gateway import (
    GatewayHealthOut,
    GatewayListResponse,
    GatewayOut,
    GatewaySimulateRequest,
    GatewaySimulateResponse,
)
from app.services import gateway_service
from app.infrastructure.gateways.registry import list_available_gateways

router = APIRouter(prefix="/gateways", tags=["Gateways"])


@router.get("", response_model=GatewayListResponse, summary="List all gateways")
async def list_all(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> GatewayListResponse:
    gateways = await gateway_service.list_gateways(db)
    return GatewayListResponse(
        gateways=[GatewayOut.model_validate(g) for g in gateways],
        available_simulators=list_available_gateways(),
    )


@router.get("/{gateway_id}", response_model=GatewayOut, summary="Get gateway details")
async def get_one(gateway_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> GatewayOut:
    gw = await gateway_service.get_gateway(db, gateway_id)
    return GatewayOut.model_validate(gw)


@router.post("/{gateway_name}/simulate", response_model=GatewaySimulateResponse, summary="Simulate payment through gateway")
async def simulate(
    gateway_name: str,
    payload: GatewaySimulateRequest,
    db: AsyncSession = Depends(get_db),
    _user=Depends(get_current_active_user),
) -> GatewaySimulateResponse:
    result = await gateway_service.simulate_payment(db, gateway_name, payload.amount, payload.currency)
    return GatewaySimulateResponse(**result)


@router.get("/{gateway_id}/health", response_model=GatewayHealthOut | None, summary="Gateway health status")
async def health(gateway_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    return await gateway_service.get_gateway_health(db, gateway_id)
