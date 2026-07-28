"""Context managers for resource management and timing.

Provides Pythonic context managers for common patterns in the codebase:
timing operations, suppressing exceptions, and managing async DB sessions.

Usage:
    with TimerContext("reconciliation") as timer:
        result = await engine.run()
        # timer.elapsed_ms contains the duration

    with suppress_exceptions(ValueError, KeyError):
        risky_operation()

    async with db_timer("fraud_scan"):
        await scan_transaction(db, txn_id)
"""

from __future__ import annotations

import time
from collections.abc import Generator
from contextlib import asynccontextmanager, contextmanager
from typing import Any, TypeVar

import structlog

logger = structlog.get_logger("utils.context_managers")

T = TypeVar("T")


class TimerContext:
    """Context manager that measures and logs execution time.

    Can be used as a simple timer or to log timing data:

        with TimerContext("my_operation") as t:
            do_work()
        print(t.elapsed_ms)  # milliseconds elapsed
    """

    def __init__(self, label: str, log_level: str = "debug") -> None:
        self.label = label
        self.log_level = log_level
        self.elapsed_ms: float = 0.0
        self._start: float = 0.0

    def __enter__(self) -> TimerContext:
        self._start = time.perf_counter()
        return self

    def __exit__(self, exc_type: type | None, exc_val: Exception | None, exc_tb: Any) -> None:
        self.elapsed_ms = (time.perf_counter() - self._start) * 1000
        log_fn = getattr(logger, self.log_level, logger.debug)
        log_fn(
            "timer_elapsed",
            label=self.label,
            elapsed_ms=round(self.elapsed_ms, 2),
            success=exc_type is None,
        )


@contextmanager
def suppress_exceptions(
    *exception_types: type[Exception],
    default: Any = None,
) -> Generator[Any, None, None]:
    """Suppress specified exceptions, returning a default value.

    Args:
        *exception_types: Exception types to suppress.
        default: Value to yield if an exception is suppressed.

    >>> with suppress_exceptions(ConnectionError, timeout=0):
    ...     result = risky_network_call()
    """
    try:
        yield default
    except exception_types as exc:
        logger.debug(
            "exception_suppressed",
            exception_type=type(exc).__name__,
            detail=str(exc),
        )


@contextmanager
def atomic_transaction_context() -> Generator[dict[str, Any], None, None]:
    """Context manager that tracks transaction state for logging.

    Yields a mutable state dict that accumulates context about
    the operation. Useful for structured logging around operations.

    >>> with atomic_transaction_context() as state:
    ...     state["step"] = "validate"
    ...     validate_input(data)
    ...     state["step"] = "persist"
    ...     save(data)
    """
    state: dict[str, Any] = {"status": "started"}
    start = time.perf_counter()
    try:
        yield state
        state["status"] = "completed"
    except Exception as exc:
        state["status"] = "failed"
        state["error"] = str(exc)
        raise
    finally:
        state["elapsed_ms"] = round((time.perf_counter() - start) * 1000, 2)


@contextmanager
def temporary_attribute(obj: Any, attr: str, value: Any) -> Generator[None, None, None]:
    """Temporarily set an attribute on an object, restoring the original on exit.

    >>> with temporary_attribute(settings, "DEBUG", True):
    ...     # settings.DEBUG is True here
    ...     run_debug_tasks()
    ... # settings.DEBUG is restored to original value
    """
    has_attr = hasattr(obj, attr)
    old_value = getattr(obj, attr, None) if has_attr else None
    setattr(obj, attr, value)
    try:
        yield
    finally:
        if has_attr:
            setattr(obj, attr, old_value)
        else:
            delattr(obj, attr)


@asynccontextmanager
async def db_timer(label: str) -> Generator[dict[str, Any], None, None]:
    """Async context manager that times database operations.

    Yields a timing dict with elapsed_ms that updates on exit:

        async with db_timer("query"):
            result = await db.execute(query)
    """
    state: dict[str, Any] = {"label": label, "elapsed_ms": 0.0}
    start = time.perf_counter()
    try:
        yield state
    finally:
        state["elapsed_ms"] = round((time.perf_counter() - start) * 1000, 2)
        logger.debug("db_operation_timing", **state)
