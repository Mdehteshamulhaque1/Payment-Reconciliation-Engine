"""Pydantic schemas — request/response validation for all API endpoints.

Schemas define the contract between the API and its consumers.
Each module corresponds to a domain area:

- auth: Login, signup, token refresh schemas
- transaction: Transaction CRUD and status update schemas
- settlement: Settlement creation and query schemas
- gateway: Gateway registration and health schemas
- reconciliation: Reconciliation run and result schemas
- rules_fraud: Fraud rule configuration and case review schemas
- reports_search: Report generation and search query schemas
- webhook: Webhook event ingestion schemas
- analytics: Dashboard metrics and aggregation schemas
"""

__all__ = [
    "auth",
    "transaction",
    "settlement",
    "gateway",
    "reconciliation",
    "rules_fraud",
    "reports_search",
    "webhook",
    "analytics",
]
