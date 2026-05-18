from pydantic import BaseModel, Field

EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=254, pattern=EMAIL_PATTERN)
    password: str = Field(..., min_length=1, max_length=128)


class AuthUser(BaseModel):
    name: str
    email: str = Field(..., min_length=5, max_length=254, pattern=EMAIL_PATTERN)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUser


class AuthStatusResponse(BaseModel):
    authenticated: bool
    user: AuthUser | None = None
