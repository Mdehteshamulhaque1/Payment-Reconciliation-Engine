from __future__ import annotations

from base64 import urlsafe_b64decode, urlsafe_b64encode
from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.schemas.auth import AuthStatusResponse, AuthUser, LoginRequest, LoginResponse

DEMO_EMAIL = "ehteshamulhaque736@gmail.com"
DEMO_PASSWORD = "123456789"
DEMO_LOGIN_ID = "ehteshamulhaque736"
TOKEN_PREFIX = "pr-engine"


def _build_user(email: str) -> AuthUser:
    return AuthUser(name="Ehteshamul Haque", email=email.lower())


def _build_token(email: str) -> str:
    payload = f"{email.lower()}:{int(datetime.now(tz=timezone.utc).timestamp())}"
    encoded = urlsafe_b64encode(payload.encode("utf-8")).decode("utf-8").rstrip("=")
    return f"{TOKEN_PREFIX}.{encoded}"


def _decode_token(token: str) -> AuthUser | None:
    if not token.startswith(f"{TOKEN_PREFIX}."):
        return None

    encoded = token.split(".", 1)[1]
    padding = "=" * (-len(encoded) % 4)

    try:
        payload = urlsafe_b64decode(f"{encoded}{padding}").decode("utf-8")
        email = payload.split(":", 1)[0]
    except (ValueError, UnicodeDecodeError):
        return None

    if email.lower() != DEMO_EMAIL:
        return None

    return _build_user(email)


def login_user(payload: LoginRequest) -> LoginResponse:
    email = (payload.email or "").strip().lower()
    login_id = (payload.login_id or "").strip().lower()
    is_valid_user = email == DEMO_EMAIL or login_id == DEMO_LOGIN_ID

    if not is_valid_user or payload.password != DEMO_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    resolved_email = email or DEMO_EMAIL
    user = _build_user(resolved_email)
    return LoginResponse(access_token=_build_token(resolved_email), user=user)


def validate_token(token: str) -> AuthStatusResponse:
    user = _decode_token(token)

    if not user:
        return AuthStatusResponse(authenticated=False, user=None)

    return AuthStatusResponse(authenticated=True, user=user)
