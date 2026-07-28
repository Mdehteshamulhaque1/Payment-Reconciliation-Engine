"""Pythonic decorators for cross-cutting concerns.

Provides timing, retry logic, caching, and rate limiting as reusable decorators.
These follow Python's descriptor protocol and functools patterns.

Usage:
    @timer
    async def slow_operation():
        ...

    @retry(max_attempts=3, delay=1.0)
    async def flaky_operation():
        ...

    @cached(ttl=300)
    async def expensive_query():
        ...
"""

from __future__ import annotations

import asyncio
import functools
import hashlib
import time
from collections.abc import Callable
from typing import Any, TypeVar

import structlog

logger = structlog.get_logger("utils.decorators")

F = TypeVar("F", bound=Callable[..., Any])


def timer(func: F) -> F:
    """Measure execution time of a function and log it.

    Works with both sync and async functions. The elapsed time
    is logged at INFO level using structlog.

    >>> @timer
    ... def process_data(items):
    ...     return len(items)
    """

    @functools.wraps(func)
    async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
        start = time.perf_counter()
        try:
            result = await func(*args, **kwargs)
            elapsed_ms = (time.perf_counter() - start) * 1000
            logger.debug(
                "function_timing",
                function=func.__qualname__,
                elapsed_ms=round(elapsed_ms, 2),
                status="success",
            )
            return result
        except Exception as exc:
            elapsed_ms = (time.perf_counter() - start) * 1000
            logger.warning(
                "function_timing",
                function=func.__qualname__,
                elapsed_ms=round(elapsed_ms, 2),
                status="error",
                error=str(exc),
            )
            raise

    @functools.wraps(func)
    def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
        start = time.perf_counter()
        try:
            result = func(*args, **kwargs)
            elapsed_ms = (time.perf_counter() - start) * 1000
            logger.debug(
                "function_timing",
                function=func.__qualname__,
                elapsed_ms=round(elapsed_ms, 2),
                status="success",
            )
            return result
        except Exception as exc:
            elapsed_ms = (time.perf_counter() - start) * 1000
            logger.warning(
                "function_timing",
                function=func.__qualname__,
                elapsed_ms=round(elapsed_ms, 2),
                status="error",
                error=str(exc),
            )
            raise

    if asyncio.iscoroutinefunction(func):
        return async_wrapper  # type: ignore[return-value]
    return sync_wrapper  # type: ignore[return-value]


def retry(
    max_attempts: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: tuple[type[Exception], ...] = (Exception,),
) -> Callable[[F], F]:
    """Retry a function on failure with exponential backoff.

    Args:
        max_attempts: Maximum number of attempts (including the first call).
        delay: Initial delay between retries in seconds.
        backoff: Multiplier applied to delay after each retry.
        exceptions: Tuple of exception types to catch and retry on.

    >>> @retry(max_attempts=5, delay=0.5, exceptions=(ConnectionError,))
    ... async def fetch_data():
    ...     ...
    """

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
            current_delay = delay
            last_exc: Exception | None = None

            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except exceptions as exc:
                    last_exc = exc
                    if attempt == max_attempts:
                        logger.error(
                            "retry_exhausted",
                            function=func.__qualname__,
                            attempts=max_attempts,
                            final_error=str(exc),
                        )
                        raise
                    logger.warning(
                        "retry_attempt",
                        function=func.__qualname__,
                        attempt=attempt,
                        max_attempts=max_attempts,
                        next_delay=current_delay,
                        error=str(exc),
                    )
                    await asyncio.sleep(current_delay)
                    current_delay *= backoff

            raise last_exc  # type: ignore[misc]

        @functools.wraps(func)
        def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
            import random

            current_delay = delay
            last_exc: Exception | None = None

            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as exc:
                    last_exc = exc
                    if attempt == max_attempts:
                        raise
                    jitter = current_delay * (0.5 + random.random())
                    time.sleep(jitter)
                    current_delay *= backoff

            raise last_exc  # type: ignore[misc]

        if asyncio.iscoroutinefunction(func):
            return async_wrapper  # type: ignore[return-value]
        return sync_wrapper  # type: ignore[return-value]

    return decorator


def cached(ttl: int = 300, maxsize: int = 128) -> Callable[[F], F]:
    """Simple TTL-based in-memory cache for async functions.

    Args:
        ttl: Time-to-live in seconds for cached results.
        maxsize: Maximum number of cached entries.

    >>> @cached(ttl=60)
    ... async def get_popular_products():
    ...     ...
    """
    _cache: dict[str, tuple[float, Any]] = {}
    _access_order: list[str] = []

    def make_key(args: tuple, kwargs: dict) -> str:
        key_parts = [str(a) for a in args]
        key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
        raw = ":".join(key_parts)
        return hashlib.md5(raw.encode(), usedforsecurity=False).hexdigest()

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
            key = make_key(args, kwargs)
            now = time.time()

            if key in _cache:
                cached_time, cached_value = _cache[key]
                if now - cached_time < ttl:
                    return cached_value
                del _cache[key]
                if key in _access_order:
                    _access_order.remove(key)

            result = await func(*args, **kwargs)

            _cache[key] = (now, result)
            _access_order.append(key)

            while len(_cache) > maxsize:
                oldest_key = _access_order.pop(0)
                _cache.pop(oldest_key, None)

            return result

        async def invalidate(*args: Any, **kwargs: Any) -> None:
            key = make_key(args, kwargs)
            _cache.pop(key, None)
            if key in _access_order:
                _access_order.remove(key)

        async def clear() -> None:
            _cache.clear()
            _access_order.clear()

        async_wrapper.invalidate = invalidate  # type: ignore[attr-defined]
        async_wrapper.clear = clear  # type: ignore[attr-defined]
        return async_wrapper  # type: ignore[return-value]

    return decorator


def rate_limit(max_calls: int = 10, period: float = 1.0) -> Callable[[F], F]:
    """Rate-limit a function to max_calls per period seconds.

    Uses a sliding window algorithm. Works for both sync and async functions.

    >>> @rate_limit(max_calls=5, period=60.0)
    ... async def call_external_api():
    ...     ...
    """
    calls: list[float] = []

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
            now = time.time()
            cutoff = now - period
            calls[:] = [t for t in calls if t > cutoff]

            if len(calls) >= max_calls:
                wait_time = calls[0] + period - now
                logger.warning(
                    "rate_limit_wait",
                    function=func.__qualname__,
                    wait_seconds=round(wait_time, 2),
                )
                await asyncio.sleep(wait_time)
                calls[:] = calls[1:]

            calls.append(time.time())
            return await func(*args, **kwargs)

        @functools.wraps(func)
        def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
            now = time.time()
            cutoff = now - period
            calls[:] = [t for t in calls if t > cutoff]

            if len(calls) >= max_calls:
                wait_time = calls[0] + period - now
                time.sleep(wait_time)
                calls[:] = calls[1:]

            calls.append(time.time())
            return func(*args, **kwargs)

        if asyncio.iscoroutinefunction(func):
            return async_wrapper  # type: ignore[return-value]
        return sync_wrapper  # type: ignore[return-value]

    return decorator
