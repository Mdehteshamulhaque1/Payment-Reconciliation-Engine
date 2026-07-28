"""Repository layer — generic CRUD with SQLAlchemy async queries.

Repositories abstract database access behind a consistent interface.
The BaseRepository provides generic CRUD operations, while concrete
repositories add domain-specific queries:

- base: Generic BaseRepository with get_by_id, create, update, delete
- transaction_repo: Transaction-specific queries (velocity, duplicates, search)
- reconciliation_repo: Reconciliation result queries and summaries
- fraud_repo: Fraud case listing and dashboard aggregation
- settlement_repo: Settlement queries by status and date range
"""

from app.repositories.base import BaseRepository
from app.repositories.transaction_repo import TransactionRepository
from app.repositories.reconciliation_repo import ReconciliationRepository
from app.repositories.fraud_repo import FraudCaseRepository
from app.repositories.settlement_repo import SettlementRepository

__all__ = [
    "BaseRepository",
    "TransactionRepository",
    "ReconciliationRepository",
    "FraudCaseRepository",
    "SettlementRepository",
]
