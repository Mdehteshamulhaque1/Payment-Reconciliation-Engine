from pydantic import BaseModel, Field

from app.infrastructure.gateways.registry import list_available_gateways


class GatewaySimulateRequest(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR", min_length=3, max_length=3)
    metadata_json: str | None = None


class GatewaySimulateResponse(BaseModel):
    success: bool
    gateway_name: str
    gateway_transaction_id: str
    status: str
    amount: float
    currency: str
    latency_ms: float
    error_message: str | None = None


class GatewayOut(BaseModel):
    id: int
    name: str
    gateway_type: str
    display_name: str
    is_active: bool
    sandbox_mode: bool

    model_config = {"from_attributes": True}


class GatewayHealthOut(BaseModel):
    gateway_id: int
    status: str
    latency_ms: float | None
    uptime_pct: float | None
    last_checked: str | None

    model_config = {"from_attributes": True}


class GatewayListResponse(BaseModel):
    gateways: list[GatewayOut]
    available_simulators: list[str]
