from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    SignupRequest,
    TokenResponse,
    UserOut,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED, summary="Register new user")
async def signup(payload: SignupRequest, db: AsyncSession = Depends(get_db)) -> UserOut:
    return await auth_service.signup_user(db, payload)


@router.post("/login", response_model=TokenResponse, summary="Login with email and password")
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    return await auth_service.login_user(db, payload)


@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
async def refresh(payload: RefreshTokenRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    return await auth_service.refresh_access_token(db, payload.refresh_token)


@router.get("/me", response_model=UserOut, summary="Get current user profile")
async def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)


@router.put("/me", response_model=UserOut, summary="Update current user profile")
async def update_me(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    return await auth_service.update_user_profile(db, current_user.id, payload)


@router.post("/change-password", response_model=MessageResponse, summary="Change password")
async def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    await auth_service.change_password(db, current_user.id, payload)
    return MessageResponse(message="Password changed successfully")


@router.post("/logout", response_model=MessageResponse, summary="Logout (revoke refresh tokens)")
async def logout(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    await auth_service.logout_user(db, current_user.id)
    return MessageResponse(message="Logged out successfully")
