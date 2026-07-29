from collections.abc import AsyncGenerator

from fastapi import Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import async_session_factory
from app.models.user import User


_dummy_user: User | None = None


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_user(
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db),
) -> User:
    global _dummy_user
    if _dummy_user is None:
        from sqlalchemy import select
        result = await db.execute(select(User).limit(1))
        _dummy_user = result.scalar_one_or_none()
        if _dummy_user is None:
            from app.models.user import User as UserModel
            _dummy_user = UserModel(
                email="admin@payflow.ai",
                full_name="Admin",
                is_active=True,
                is_superuser=True,
                role="admin",
            )
            db.add(_dummy_user)
            await db.commit()
            await db.refresh(_dummy_user)
    return _dummy_user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user


async def require_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user


class PaginationParams:
    def __init__(
        self,
        page: int = Query(default=1, ge=1, description="Page number"),
        size: int = Query(default=20, ge=1, le=100, description="Page size"),
    ):
        self.page = page
        self.size = size
        self.offset = (page - 1) * size
