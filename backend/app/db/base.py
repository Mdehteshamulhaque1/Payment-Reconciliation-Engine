from sqlalchemy.ext.asyncio import AsyncAttrs, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.sqlalchemy_database_uri,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    **({} if settings.is_sqlite else {"pool_recycle": 3600}),
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase, AsyncAttrs):
    pass
