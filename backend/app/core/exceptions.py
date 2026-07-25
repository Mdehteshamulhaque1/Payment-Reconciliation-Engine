import time
import traceback
from typing import Any

import structlog
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = structlog.get_logger("core.exceptions")


class AppException(Exception):
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str = "GENERAL_ERROR",
        headers: dict[str, str] | None = None,
        context: dict[str, Any] | None = None,
    ):
        self.status_code = status_code
        self.detail = detail
        self.error_code = error_code
        self.headers = headers
        self.context = context or {}


class NotFoundException(AppException):
    def __init__(self, resource: str = "Resource", resource_id: Any = None):
        detail = f"{resource} not found"
        if resource_id:
            detail = f"{resource} with id '{resource_id}' not found"
        super().__init__(status_code=404, detail=detail, error_code="NOT_FOUND")


class AlreadyExistsException(AppException):
    def __init__(self, resource: str = "Resource", detail: str | None = None):
        super().__init__(
            status_code=409,
            detail=detail or f"{resource} already exists",
            error_code="ALREADY_EXISTS",
        )


class UnauthorizedException(AppException):
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(status_code=401, detail=detail, error_code="UNAUTHORIZED")


class ForbiddenException(AppException):
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(status_code=403, detail=detail, error_code="FORBIDDEN")


class BadRequestException(AppException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=400, detail=detail, error_code="BAD_REQUEST")


class ConflictException(AppException):
    def __init__(self, detail: str = "Conflict"):
        super().__init__(status_code=409, detail=detail, error_code="CONFLICT")


class IdempotencyConflict(AppException):
    def __init__(self, detail: str = "Request already in progress"):
        super().__init__(status_code=409, detail=detail, error_code="IDEMPOTENCY_CONFLICT")


class GatewayException(AppException):
    def __init__(self, gateway: str = "gateway", detail: str = "Gateway error"):
        super().__init__(status_code=502, detail=detail, error_code="GATEWAY_ERROR", context={"gateway": gateway})


class WebhookException(AppException):
    def __init__(self, source: str = "unknown", detail: str = "Webhook processing error"):
        super().__init__(status_code=400, detail=detail, error_code="WEBHOOK_ERROR", context={"source": source})


class RateLimitException(AppException):
    def __init__(self, retry_after: int = 60):
        super().__init__(
            status_code=429,
            detail="Rate limit exceeded",
            error_code="RATE_LIMITED",
            headers={"Retry-After": str(retry_after)},
        )


class ReconciliationException(AppException):
    def __init__(self, detail: str = "Reconciliation error"):
        super().__init__(status_code=500, detail=detail, error_code="RECONCILIATION_ERROR")


async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
    request_id = getattr(_request.state, "request_id", "unknown")
    logger.error(
        "app_exception",
        error_code=exc.error_code,
        detail=exc.detail,
        status_code=exc.status_code,
        request_id=request_id,
        context=exc.context,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.error_code,
                "message": exc.detail,
            },
            "request_id": request_id,
            "timestamp": time.time(),
        },
        headers=exc.headers,
    )


async def validation_exception_handler(_request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(_request.state, "request_id", "unknown")
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        errors.append({"field": loc, "message": err.get("msg", "Invalid value"), "type": err.get("type", "unknown")})

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "details": errors,
            },
            "request_id": request_id,
            "timestamp": time.time(),
        },
    )


async def generic_exception_handler(_request: Request, _exc: Exception) -> JSONResponse:
    request_id = getattr(_request.state, "request_id", "unknown")
    logger.error(
        "unhandled_exception",
        exception_type=type(_exc).__name__,
        detail=str(_exc),
        request_id=request_id,
        traceback=traceback.format_exc() if not isinstance(_exc, AppException) else None,
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
            },
            "request_id": request_id,
            "timestamp": time.time(),
        },
    )


def register_exception_handlers(app: Any) -> None:
    from fastapi.exceptions import RequestValidationError as ValidationErr

    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(ValidationErr, validation_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
