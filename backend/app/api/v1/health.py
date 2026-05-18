from fastapi import APIRouter

from app.schemas.health import HealthCheckResponse
from app.services.health_service import build_health_response


router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthCheckResponse, summary="Health check")
def health_check() -> HealthCheckResponse:
    return build_health_response()
