from pydantic import BaseModel, Field, model_validator

EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"


class LoginRequest(BaseModel):
    email: str | None = Field(default=None, min_length=5, max_length=254, pattern=EMAIL_PATTERN)
    login_id: str | None = Field(default=None, min_length=3, max_length=254)
    password: str = Field(..., min_length=1, max_length=128)

    @model_validator(mode="after")
    def validate_identifier(self) -> "LoginRequest":
        if not self.email and not self.login_id:
            raise ValueError("Either email or login_id is required.")
        return self


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
