from fastapi import APIRouter, Header, HTTPException, status

from app.schemas.auth import AuthStatusResponse, LoginRequest, LoginResponse
from app.services.auth_service import login_user, validate_token


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse, summary="Login with demo credentials")
def login(payload: LoginRequest) -> LoginResponse:
    return login_user(payload)


@router.get("/me", response_model=AuthStatusResponse, summary="Validate bearer token")
def me(authorization: str | None = Header(default=None)) -> AuthStatusResponse:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token.")

    token = authorization.split(" ", 1)[1].strip()
    return validate_token(token)
