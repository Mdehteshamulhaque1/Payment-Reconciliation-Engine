from typing import Any, Generic, Sequence, TypeVar

from sqlalchemy import func, select, delete as sa_delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id: int) -> ModelType | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_all(
        self,
        offset: int = 0,
        limit: int = 20,
        order_by: Any = None,
        filters: list | None = None,
    ) -> tuple[Sequence[ModelType], int]:
        query = select(self.model)
        count_query = select(func.count(self.model.id))

        if filters:
            for f in filters:
                query = query.where(f)
                count_query = count_query.where(f)

        total = (await self.db.execute(count_query)).scalar() or 0

        if order_by is not None:
            query = query.order_by(order_by)
        else:
            if hasattr(self.model, "created_at"):
                query = query.order_by(self.model.created_at.desc())

        query = query.offset(offset).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def create(self, **kwargs: Any) -> ModelType:
        instance = self.model(**kwargs)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: ModelType, **kwargs: Any) -> ModelType:
        for key, value in kwargs.items():
            if value is not None and hasattr(instance, key):
                setattr(instance, key, value)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def delete(self, id: int) -> bool:
        result = await self.db.execute(sa_delete(self.model).where(self.model.id == id))
        return result.rowcount > 0

    async def count(self, filters: list | None = None) -> int:
        query = select(func.count(self.model.id))
        if filters:
            for f in filters:
                query = query.where(f)
        return (await self.db.execute(query)).scalar() or 0

    async def exists(self, **kwargs: Any) -> bool:
        query = select(self.model.id)
        for key, value in kwargs.items():
            if hasattr(self.model, key):
                query = query.where(getattr(self.model, key) == value)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None
