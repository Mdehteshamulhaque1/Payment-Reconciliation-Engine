"""Simple security helpers (placeholder)."""
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from typing import Optional
from .config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(subject: str, expires_minutes: int = 60) -> str:
    settings = get_settings()
    to_encode = {"sub": subject, "exp": datetime.utcnow() + timedelta(minutes=expires_minutes)}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)

def decode_token(token: str) -> Optional[dict]:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
    except Exception:
        return None
