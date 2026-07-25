from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import setup_logging
from app.db.base import async_session_factory
from app.db.session import check_db_health, init_db
from app.middleware import RateLimiterMiddleware, RequestIDMiddleware, RequestLoggingMiddleware
from app.infrastructure.metrics import metrics, ACTIVE_CONNECTIONS
from app.infrastructure.realtime.broadcaster import ws_manager


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    setup_logging()

    settings = get_settings()
    metrics.update_app_info(version=settings.APP_VERSION, environment=settings.ENVIRONMENT)

    try:
        from app.infrastructure.metrics import REGISTRY
        import prometheus_client
        prometheus_client.REGISTRY = REGISTRY
    except Exception:
        pass

    try:
        from redis.asyncio import from_url as redis_from_url
        redis = redis_from_url(settings.REDIS_URL, decode_responses=True)
        await redis.ping()
        app.state.redis = redis
    except Exception:
        app.state.redis = None

    await init_db()
    async with async_session_factory() as db:
        from app.services.gateway_service import ensure_seed_gateways
        await ensure_seed_gateways(db)

    ACTIVE_CONNECTIONS.set(0)

    yield

    if getattr(app.state, "redis", None):
        try:
            await app.state.redis.aclose()
        except Exception:
            pass


settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(RequestIDMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimiterMiddleware, max_requests=settings.RATE_LIMIT_PER_MINUTE, window_seconds=60)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

from app.api.router import api_router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
async def root() -> dict[str, str]:
    return {"message": f"{settings.APP_NAME} v{settings.APP_VERSION} is running"}


@app.get("/health", tags=["Health"])
async def health() -> dict[str, str]:
    db_ok = await check_db_health()
    redis_ok = False
    if getattr(app.state, "redis", None):
        try:
            await app.state.redis.ping()
            redis_ok = True
        except Exception:
            pass
    overall = "healthy" if db_ok else "degraded"
    return {
        "status": overall,
        "database": "healthy" if db_ok else "unavailable",
        "redis": "healthy" if redis_ok else "unavailable",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/metrics", tags=["Metrics"], include_in_schema=False)
async def metrics_endpoint():
    from fastapi.responses import Response
    body, content_type = metrics.render()
    return Response(content=body, media_type=content_type)


@app.get("/ws/stats", tags=["WebSocket"])
async def ws_stats():
    return await ws_manager.get_stats()
