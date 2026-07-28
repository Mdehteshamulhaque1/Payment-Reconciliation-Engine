"""Business logic services — transaction processing, fraud detection, reconciliation.

Service layer contains the core domain logic. Each service module
focuses on a single bounded context:

- transaction_service: CRUD + lifecycle management for transactions
- fraud_detector: Rule-based fraud detection with risk scoring
- reconciliation_engine: Multi-source matching with confidence scoring
- settlement_service: Settlement processing and tracking
- gateway_service: Payment gateway orchestration
- auth_service: Authentication and authorization logic
- ledger_service: Double-entry bookkeeping entries
- notification_service: Multi-channel notification dispatch
- reporting_service: Report generation and scheduling
- search_service: Full-text search across entities
- rule_engine: Configurable rule evaluation
- analytics_service: Dashboard metrics and aggregation
"""

__all__ = [
    "transaction_service",
    "fraud_detector",
    "reconciliation_engine",
    "settlement_service",
    "gateway_service",
    "auth_service",
    "ledger_service",
    "notification_service",
    "reporting_service",
    "search_service",
    "rule_engine",
    "analytics_service",
]
