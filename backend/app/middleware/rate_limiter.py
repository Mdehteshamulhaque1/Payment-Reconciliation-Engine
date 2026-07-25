import time
from collections import defaultdict

import structlog
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse, Response

from app.core.config import get_settings

logger = structlog.get_logger("middleware.rate_limiter")


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._webhook_paths = {"/webhooks/"}

    def _is_webhook_path(self, path: str) -> bool:
        return any(path.startswith(wp) for wp in self._webhook_paths)

    def _is_auth_path(self, path: str) -> bool:
        return path.startswith("/auth/")

    def _get_client_key(self, request: Request) -> str:
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"user:{user_id}"
        ip = request.client.host if request.client else "unknown"
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        return f"ip:{ip}"

    def _path_type_label(self, path: str) -> str:
        if self._is_webhook_path(path):
            return "webhook"
        if self._is_auth_path(path):
            return "auth"
        return "general"

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        settings = get_settings()
        client_key = self._get_client_key(request)

        if self._is_webhook_path(request.url.path):
            max_req = settings.RATE_LIMIT_WEBHOOK_PER_MINUTE
        elif self._is_auth_path(request.url.path):
            max_req = settings.RATE_LIMIT_AUTH_PER_MINUTE
        else:
            max_req = self.max_requests

        now = time.time()
        cutoff = now - self.window_seconds
        self._requests[client_key] = [t for t in self._requests[client_key] if t > cutoff]

        if len(self._requests[client_key]) >= max_req:
            retry_after = int(self._requests[client_key][0] + self.window_seconds - now) + 1
            logger.warning("rate_limit_exceeded", client_key=client_key, path=request.url.path, limit=max_req)
            try:
                from app.infrastructure.metrics import RATE_LIMIT_HITS
                RATE_LIMIT_HITS.labels(path_type=self._path_type_label(request.url.path)).inc()
            except Exception:
                pass
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "error": {"code": "RATE_LIMITED", "message": "Too many requests"},
                    "retry_after": retry_after,
                    "timestamp": time.time(),
                },
                headers={"Retry-After": str(retry_after)},
            )

        self._requests[client_key].append(now)
        return await call_next(request)
