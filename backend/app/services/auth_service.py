from datetime import datetime, timedelta, timezone

from jose import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import AlreadyExistsException, BadRequestException, UnauthorizedException
from app.core.security import create_token, decode_token, get_password_hash, verify_password
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    ResetPasswordRequest,
    SignupRequest,
    TokenResponse,
    UserOut,
)

settings = get_settings()


async def signup_user(db: AsyncSession, payload: SignupRequest) -> UserOut:
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    if result.scalar_one_or_none():
        raise AlreadyExistsException("User", f"Email {payload.email} is already registered")

    user = User(
        email=payload.email.lower(),
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        is_active=True,
        is_verified=False,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return UserOut.model_validate(user)


async def login_user(db: AsyncSession, payload: LoginRequest) -> TokenResponse:
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(payload.password, user.hashed_password):
        raise UnauthorizedException("Invalid email or password")

    if not user.is_active:
        raise UnauthorizedException("Account is deactivated")

    access_token = create_token(user.id, token_type="access")
    refresh_token = create_token(user.id, token_type="extra", extra={"purpose": "refresh"})

    db_refresh = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(db_refresh)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def refresh_access_token(db: AsyncSession, refresh_token: str) -> TokenResponse:
    payload = decode_token(refresh_token)
    if payload is None:
        raise UnauthorizedException("Invalid refresh token")

    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == refresh_token,
            RefreshToken.is_revoked == False,
        )
    )
    db_token = result.scalar_one_or_none()

    if db_token is None:
        raise UnauthorizedException("Refresh token not found or revoked")

    if db_token.expires_at < datetime.now(timezone.utc):
        raise UnauthorizedException("Refresh token expired")

    user_id = payload.get("sub")
    new_access = create_token(int(user_id), token_type="access")

    return TokenResponse(
        access_token=new_access,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def logout_user(db: AsyncSession, user_id: int) -> None:
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.user_id == user_id, RefreshToken.is_revoked == False)
    )
    tokens = result.scalars().all()
    for token in tokens:
        token.is_revoked = True
    await db.commit()


async def get_user_profile(db: AsyncSession, user_id: int) -> UserOut:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise UnauthorizedException("User not found")
    return UserOut.model_validate(user)


async def update_user_profile(db: AsyncSession, user_id: int, data: dict) -> UserOut:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise UnauthorizedException("User not found")

    for key, value in data.items():
        if value is not None:
            setattr(user, key, value)

    await db.commit()
    await db.refresh(user)
    return UserOut.model_validate(user)


async def change_password(db: AsyncSession, user_id: int, payload: ChangePasswordRequest) -> None:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise UnauthorizedException("User not found")

    if not verify_password(payload.current_password, user.hashed_password):
        raise BadRequestException("Current password is incorrect")

    user.hashed_password = get_password_hash(payload.new_password)
    await db.commit()
