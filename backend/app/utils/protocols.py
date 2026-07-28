"""Protocol classes for structural subtyping.

Defines Protocol interfaces that enable structural (duck) typing
across the codebase. These are checked at type-check time only
and have zero runtime cost.

Usage:
    from app.utils.protocols import Repository, PaymentGateway

    def process(repo: Repository) -> None:
        # Works with any object that has .get_by_id() and .create()
        item = repo.get_by_id(1)
        repo.create(name="test")
"""

from __future__ import annotations

from typing import Any, Protocol, TypeVar, runtime_checkable

from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


@runtime_checkable
class Repository(Protocol[T]):
    """Protocol for repository pattern — generic CRUD operations.

    Any class implementing get_by_id, create, update, delete,
    and get_all satisfies this protocol without inheriting from it.
    """

    model: type[T]
    db: AsyncSession

    async def get_by_id(self, id: int) -> T | None: ...

    async def create(self, **kwargs: Any) -> T: ...

    async def update(self, instance: T, **kwargs: Any) -> T: ...

    async def delete(self, id: int) -> bool: ...

    async def get_all(
        self, offset: int = 0, limit: int = 20, **kwargs: Any
    ) -> tuple[list[T], int]: ...


@runtime_checkable
class PaymentGateway(Protocol):
    """Protocol for payment gateway implementations.

    Any gateway simulator or real adapter must provide
    process_payment and process_refund methods.
    """

    @property
    def gateway_prefix(self) -> str: ...

    def process_payment(
        self, amount: float, currency: str = "INR", metadata: dict | None = None
    ) -> Any: ...

    def process_refund(self, gateway_txn_id: str, amount: float) -> Any: ...


@runtime_checkable
class Serializable(Protocol):
    """Protocol for objects that can be serialized to dict/JSON.

    Used for consistent serialization across models, schemas,
    and service responses.
    """

    def to_dict(self) -> dict[str, Any]: ...


@runtime_checkable
class HealthCheckable(Protocol):
    """Protocol for components that can report their health status.

    Used by the health check endpoint to aggregate status
    from database, Redis, gateways, etc.
    """

    async def check_health(self) -> dict[str, Any]: ...


@runtime_checkable
class Notifiable(Protocol):
    """Protocol for notification dispatchers.

    Any notification channel (email, SMS, push) must implement
    this protocol to be usable by the notification service.
    """

    async def send(
        self,
        recipient: str,
        subject: str,
        body: str,
        **kwargs: Any,
    ) -> bool: ...


@runtime_checkable
class Cacheable(Protocol):
    """Protocol for caching backends.

    Supports basic get/set/delete operations with optional TTL.
    """

    async def get(self, key: str) -> Any | None: ...

    async def set(self, key: str, value: Any, ttl: int | None = None) -> None: ...

    async def delete(self, key: str) -> None: ...

    async def exists(self, key: str) -> bool: ...


@runtime_checkable
class MetricRecorder(Protocol):
    """Protocol for metrics recording backends.

    Abstracts metrics collection so it can be swapped
    (Prometheus, StatsD, in-memory, no-op for tests).
    """

    def increment(self, name: str, value: float = 1.0, **tags: str) -> None: ...

    def gauge(self, name: str, value: float, **tags: str) -> None: ...

    def histogram(self, name: str, value: float, **tags: str) -> None: ...
