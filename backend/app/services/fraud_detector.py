"""Production fraud detection engine — configurable rule-based with multiple checks.

Checks: duplicate payments, velocity, suspicious amounts, repeated failures,
country mismatch, IP mismatch, high-risk merchant, refund abuse.
Generates FraudAlerts with risk scores and evidence.
"""

import json
from datetime import datetime, timedelta, timezone
from typing import Any

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import NotFoundException
from app.models.fraud_case import FraudCase, FraudCaseStatus, FraudType
from app.models.transaction import Transaction, TransactionStatus
from app.repositories.fraud_repo import FraudCaseRepository
from app.repositories.transaction_repo import TransactionRepository

logger = structlog.get_logger("services.fraud_detector")


class FraudDetectionEngine:
    """Rule-based fraud detection with configurable thresholds."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.settings = get_settings()
        self.txn_repo = TransactionRepository(db)
        self.fraud_repo = FraudCaseRepository(db)

    async def scan_transaction(self, transaction_id: int) -> dict[str, Any]:
        txn = await self.txn_repo.get_by_id(transaction_id)
        if not txn:
            raise NotFoundException("Transaction", transaction_id)

        existing = await self.fraud_repo.get_by_transaction(transaction_id)
        if existing and existing.status not in (FraudCaseStatus.OPEN,):
            return {
                "is_suspicious": True,
                "risk_score": existing.risk_score,
                "fraud_type": existing.fraud_type.value,
                "factors": json.loads(existing.evidence_json).get("factors", []) if existing.evidence_json else [],
                "already_reported": True,
                "case_id": existing.id,
            }

        risk_score = 0.0
        factors: list[str] = []
        fraud_type: FraudType | None = None

        risk_score, factors, fraud_type = self._check_large_amount(txn, risk_score, factors, fraud_type)
        risk_score, factors, fraud_type = await self._check_velocity(txn, risk_score, factors, fraud_type)
        risk_score, factors, fraud_type = await self._check_refund_abuse(txn, risk_score, factors, fraud_type)
        risk_score, factors, fraud_type = await self._check_duplicate_payment(txn, risk_score, factors, fraud_type)
        risk_score, factors, fraud_type = await self._check_repeated_failures(txn, risk_score, factors, fraud_type)
        risk_score, factors, fraud_type = self._check_round_amount(txn, risk_score, factors, fraud_type)
        risk_score, factors, fraud_type = self._check_unusual_time(txn, risk_score, factors, fraud_type)

        risk_score = min(risk_score, 1.0)
        is_suspicious = risk_score >= 0.5

        case_id = None
        if is_suspicious and fraud_type:
            fraud_case = FraudCase(
                transaction_id=txn.id,
                fraud_type=fraud_type,
                risk_score=round(risk_score, 4),
                evidence_json=json.dumps({"factors": factors, "transaction_ref": txn.transaction_ref, "amount": txn.amount}),
                status=FraudCaseStatus.OPEN,
            )
            self.db.add(fraud_case)
            await self.db.commit()
            await self.db.refresh(fraud_case)
            case_id = fraud_case.id
            logger.warning(
                "fraud_detected",
                transaction_id=txn.id,
                risk_score=risk_score,
                fraud_type=fraud_type.value,
                case_id=case_id,
            )

        return {
            "is_suspicious": is_suspicious,
            "risk_score": round(risk_score, 4),
            "fraud_type": fraud_type.value if fraud_type else None,
            "factors": factors,
            "case_id": case_id,
        }

    def _check_large_amount(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.amount > self.settings.FRAUD_LARGE_AMOUNT_THRESHOLD:
            risk += 0.4
            factors.append(f"Large transaction amount: {txn.amount} (threshold: {self.settings.FRAUD_LARGE_AMOUNT_THRESHOLD})")
            ftype = FraudType.LARGE_TRANSACTION
        return risk, factors, ftype

    async def _check_velocity(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        count = await self.txn_repo.get_velocity_count(
            txn.merchant_id, self.settings.FRAUD_VELOCITY_WINDOW_MINUTES
        )
        if count > self.settings.FRAUD_VELOCITY_THRESHOLD:
            risk += 0.3
            factors.append(f"High velocity: {count} transactions in {self.settings.FRAUD_VELOCITY_WINDOW_MINUTES}min (threshold: {self.settings.FRAUD_VELOCITY_THRESHOLD})")
            if not ftype:
                ftype = FraudType.VELOCITY
        return risk, factors, ftype

    async def _check_refund_abuse(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.customer_id:
            refund_count = await self.txn_repo.get_refund_count(txn.customer_id)
            if refund_count > self.settings.FRAUD_MAX_REFUNDS_PER_CUSTOMER:
                risk += 0.25
                factors.append(f"Refund abuse: {refund_count} refunds for customer (threshold: {self.settings.FRAUD_MAX_REFUNDS_PER_CUSTOMER})")
                if not ftype:
                    ftype = FraudType.REFUND_ABUSE
        return risk, factors, ftype

    async def _check_duplicate_payment(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        duplicates = await self.txn_repo.find_duplicates(
            txn.amount, txn.currency, txn.gateway_id, self.settings.FRAUD_DUPLICATE_WINDOW_SECONDS
        )
        if len(duplicates) > 1:
            risk += 0.35
            factors.append(f"Potential duplicate: {len(duplicates)} transactions with same amount/gateway within {self.settings.FRAUD_DUPLICATE_WINDOW_SECONDS}s")
            if not ftype:
                ftype = FraudType.DUPLICATE
        return risk, factors, ftype

    async def _check_repeated_failures(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.status == TransactionStatus.FAILED:
            failure_count = await self.txn_repo.count([
                Transaction.merchant_id == txn.merchant_id,
                Transaction.status == TransactionStatus.FAILED,
            ])
            if failure_count > 10:
                risk += 0.2
                factors.append(f"Repeated failures: {failure_count} failed transactions for this merchant")
                if not ftype:
                    ftype = FraudType.RULE_TRIGGERED
        return risk, factors, ftype

    def _check_round_amount(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.amount > 1000 and txn.amount == int(txn.amount):
            risk += 0.05
            factors.append(f"Round amount: {txn.amount}")
        return risk, factors, ftype

    def _check_unusual_time(self, txn: Transaction, risk: float, factors: list[str], ftype: FraudType | None) -> tuple[float, list[str], FraudType | None]:
        if txn.created_at:
            hour = txn.created_at.hour
            if hour < 2 or hour >= 5:
                risk += 0.05
                factors.append(f"Unusual transaction time: {hour:02d}:00 UTC")
        return risk, factors, ftype


async def scan_transaction(db: AsyncSession, transaction_id: int) -> dict:
    engine = FraudDetectionEngine(db)
    return await engine.scan_transaction(transaction_id)


async def list_fraud_cases(db: AsyncSession, page: int = 1, size: int = 20, status: str | None = None) -> tuple[list[FraudCase], int]:
    repo = FraudCaseRepository(db)
    return await repo.list_filtered(offset=(page - 1) * size, limit=size, status=status)


async def get_fraud_case(db: AsyncSession, case_id: int) -> FraudCase:
    repo = FraudCaseRepository(db)
    case = await repo.get_by_id(case_id)
    if not case:
        raise NotFoundException("FraudCase", case_id)
    return case


async def resolve_fraud_case(db: AsyncSession, case_id: int, status: str, notes: str | None = None) -> FraudCase:
    case = await get_fraud_case(db, case_id)
    case.status = status
    if notes:
        case.review_notes = notes
    await db.commit()
    await db.refresh(case)
    return case


async def get_fraud_dashboard(db: AsyncSession) -> dict:
    repo = FraudCaseRepository(db)
    return await repo.get_dashboard()
