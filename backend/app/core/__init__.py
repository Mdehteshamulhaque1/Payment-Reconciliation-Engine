"""Core infrastructure — configuration, security, exceptions, logging, Redis, Celery.

This package provides the foundational building blocks for the application:

- config: Pydantic settings with environment variable binding
- security: JWT token creation/verification, password hashing
- exceptions: Custom exception hierarchy with FastAPI handlers
- logging: structlog-based structured logging configuration
- redis_client: Async Redis singleton connection manager
- celery_app: Celery beat/worker configuration
- dependencies: FastAPI dependency injection (get_db, get_current_user)
"""

from app.core.config import Settings, get_settings
from app.core.security import create_token, decode_token, get_password_hash, verify_password
from app.core.exceptions import (
    AppException,
    NotFoundException,
    AlreadyExistsException,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
    ConflictException,
    IdempotencyConflict,
    GatewayException,
    WebhookException,
    RateLimitException,
    ReconciliationException,
)

__all__ = [
    # Config
    "Settings",
    "get_settings",
    # Security
    "create_token",
    "decode_token",
    "get_password_hash",
    "verify_password",
    # Exceptions
    "AppException",
    "NotFoundException",
    "AlreadyExistsException",
    "UnauthorizedException",
    "ForbiddenException",
    "BadRequestException",
    "ConflictException",
    "IdempotencyConflict",
    "GatewayException",
    "WebhookException",
    "RateLimitException",
    "ReconciliationException",
]
