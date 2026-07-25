"""Prometheus metrics for every subsystem.

All metric names use the prefix `pre_` (Payment Reconciliation Engine).
Uses prometheus_client for zero-dependency collection; /metrics endpoint
serves the text format consumed by Prometheus.
"""

from __future__ import annotations

import time
from contextlib import contextmanager
from typing import Generator

from prometheus_client import (
    CollectorRegistry,
    Counter,
    Gauge,
    Histogram,
    Info,
    generate_latest,
    CONTENT_TYPE_LATEST,
)

REGISTRY = CollectorRegistry(auto_describe=True)

# ── HTTP layer ───────────────────────────────────────────────────────────
REQUEST_COUNT = Counter(
    "pre_http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status"],
    registry=REGISTRY,
)

REQUEST_LATENCY = Histogram(
    "pre_http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0),
    registry=REGISTRY,
)

RATE_LIMIT_HITS = Counter(
    "pre_rate_limit_hits_total",
    "Rate limit rejections",
    ["path_type"],
    registry=REGISTRY,
)

# ── WebSocket ────────────────────────────────────────────────────────────
ACTIVE_CONNECTIONS = Gauge(
    "pre_ws_active_connections",
    "Current WebSocket connections",
    registry=REGISTRY,
)

# ── Transactions ─────────────────────────────────────────────────────────
TRANSACTION_COUNT = Counter(
    "pre_transactions_total",
    "Total transactions",
    ["status", "gateway", "currency"],
    registry=REGISTRY,
)

TRANSACTION_AMOUNT = Histogram(
    "pre_transaction_amount",
    "Transaction amount distribution",
    ["currency"],
    buckets=(10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000),
    registry=REGISTRY,
)

# ── Reconciliation ───────────────────────────────────────────────────────
RECONCILIATION_RUNS = Counter(
    "pre_reconciliation_runs_total",
    "Reconciliation batch runs",
    ["status"],
    registry=REGISTRY,
)

RECONCILIATION_RESULTS = Counter(
    "pre_reconciliation_results_total",
    "Reconciliation results by type",
    ["discrepancy_type"],
    registry=REGISTRY,
)

# ── Fraud detection ──────────────────────────────────────────────────────
FRAUD_CASES_DETECTED = Counter(
    "pre_fraud_cases_detected_total",
    "Fraud cases detected",
    ["fraud_type"],
    registry=REGISTRY,
)

# ── Webhooks ─────────────────────────────────────────────────────────────
WEBHOOK_EVENTS_RECEIVED = Counter(
    "pre_webhook_events_received_total",
    "Incoming webhook events",
    ["source", "event_type"],
    registry=REGISTRY,
)

WEBHOOK_EVENTS_PROCESSED = Counter(
    "pre_webhook_events_processed_total",
    "Webhook events processed",
    ["source", "status"],
    registry=REGISTRY,
)

# ── Gateway health ──────────────────────────────────────────────────────
GATEWAY_HEALTH_STATUS = Gauge(
    "pre_gateway_health_status",
    "Gateway health status (1=healthy, 0=unhealthy)",
    ["gateway"],
    registry=REGISTRY,
)

# ── Settlements ──────────────────────────────────────────────────────────
SETTLEMENT_COUNT = Counter(
    "pre_settlements_total",
    "Settlements processed",
    ["status"],
    registry=REGISTRY,
)

# ── Celery tasks ────────────────────────────────────────────────────────
CELERY_TASK_DURATION = Histogram(
    "pre_celery_task_duration_seconds",
    "Celery task execution time",
    ["task_name", "status"],
    buckets=(0.1, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0, 60.0, 120.0),
    registry=REGISTRY,
)

APP_INFO = Info(
    "pre_app",
    "Application metadata",
    registry=REGISTRY,
)


class MetricsCollector:
    """High-level helpers wrapping raw prometheus_client metrics."""

    @staticmethod
    @contextmanager
    def track_request(method: str, endpoint: str) -> Generator[None, None, None]:
        start = time.perf_counter()
        try:
            yield
            status = "200"
        except Exception:
            status = "500"
            raise
        finally:
            duration = time.perf_counter() - start
            REQUEST_COUNT.labels(method=method, endpoint=endpoint, status=status).inc()
            REQUEST_LATENCY.labels(method=method, endpoint=endpoint).observe(duration)

    @staticmethod
    def record_transaction(status: str, gateway: str, currency: str, amount: float) -> None:
        TRANSACTION_COUNT.labels(status=status, gateway=gateway, currency=currency).inc()
        TRANSACTION_AMOUNT.labels(currency=currency).observe(amount)

    @staticmethod
    def record_reconciliation(status: str, results: dict[str, int] | None = None) -> None:
        RECONCILIATION_RUNS.labels(status=status).inc()
        if results:
            for dtype, count in results.items():
                for _ in range(count):
                    RECONCILIATION_RESULTS.labels(discrepancy_type=dtype).inc()

    @staticmethod
    def record_fraud(fraud_type: str) -> None:
        FRAUD_CASES_DETECTED.labels(fraud_type=fraud_type).inc()

    @staticmethod
    def record_webhook(source: str, event_type: str) -> None:
        WEBHOOK_EVENTS_RECEIVED.labels(source=source, event_type=event_type).inc()

    @staticmethod
    def record_webhook_processed(source: str, status: str) -> None:
        WEBHOOK_EVENTS_PROCESSED.labels(source=source, status=status).inc()

    @staticmethod
    def set_gateway_health(gateway: str, healthy: bool) -> None:
        GATEWAY_HEALTH_STATUS.labels(gateway=gateway).set(1 if healthy else 0)

    @staticmethod
    def record_settlement(status: str) -> None:
        SETTLEMENT_COUNT.labels(status=status).inc()

    @staticmethod
    @contextmanager
    def track_celery_task(task_name: str) -> Generator[None, None, None]:
        start = time.perf_counter()
        try:
            yield
        except Exception:
            duration = time.perf_counter() - start
            CELERY_TASK_DURATION.labels(task_name=task_name, status="failure").observe(duration)
            raise
        else:
            duration = time.perf_counter() - start
            CELERY_TASK_DURATION.labels(task_name=task_name, status="success").observe(duration)

    @staticmethod
    def update_app_info(version: str, environment: str) -> None:
        APP_INFO.info({"version": version, "environment": environment})

    @staticmethod
    def render() -> tuple[bytes, str]:
        return generate_latest(REGISTRY), CONTENT_TYPE_LATEST


metrics = MetricsCollector()
