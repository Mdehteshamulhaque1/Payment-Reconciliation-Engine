from fastapi import APIRouter
from app.db.session import check_db_health
from app.core.config import get_settings

router = APIRouter(prefix="/monitoring", tags=["Monitoring"])


@router.get("/health", summary="Liveness probe")
async def liveness():
    return {"status": "alive"}


@router.get("/ready", summary="Readiness probe")
async def readiness():
    db_ok = await check_db_health()
    return {"status": "ready" if db_ok else "not_ready", "database": "ok" if db_ok else "unavailable"}


@router.get("/metrics", summary="Prometheus-style metrics")
async def metrics():
    settings = get_settings()
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": "healthy" if await check_db_health() else "unhealthy",
    }
