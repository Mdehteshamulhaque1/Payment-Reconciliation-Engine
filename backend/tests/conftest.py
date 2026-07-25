import asyncio
import os
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["REDIS_URL"] = "redis://localhost:6379/15"
os.environ["CELERY_BROKER_URL"] = "redis://localhost:6379/15"
os.environ["SECRET_KEY"] = "test-secret-key-do-not-use-in-prod"
os.environ["ENVIRONMENT"] = "testing"

from app.db.base import Base


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def engine():
    from app.db.session import import_all_models
    import_all_models()
    eng = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield eng
    await eng.dispose()


@pytest_asyncio.fixture
async def db(engine) -> AsyncGenerator[AsyncSession, None]:
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(engine) -> AsyncGenerator[AsyncClient, None]:
    from app.main import app
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async def override_get_db():
        async with session_factory() as session:
            yield session

    from app.core.dependencies import get_db
    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def seed_gateway(engine):
    from app.models.payment_gateway import PaymentGateway, GatewayType
    async with async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)() as db:
        result = await db.execute(
            select(PaymentGateway).where(PaymentGateway.name == "stripe")
        )
        existing = result.scalar_one_or_none()
        if existing:
            return existing.id

        gw = PaymentGateway(
            name="stripe",
            gateway_type=GatewayType.STRIPE,
            display_name="Stripe",
            is_active=True,
            sandbox_mode=True,
        )
        db.add(gw)
        await db.commit()
        await db.refresh(gw)
        return gw.id
