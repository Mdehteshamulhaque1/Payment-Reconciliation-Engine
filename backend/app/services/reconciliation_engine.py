"""Production reconciliation engine — multi-source matching with confidence scoring.

Compares: Internal Transaction -> Gateway Record -> Settlement -> Bank Confirmation.
Classifies every transaction as: match, amount_mismatch, missing_settlement,
missing_gateway, duplicate, partial_settlement, delayed, missing_bank.
"""

import json
import uuid
from datetime import datetime, timezone
from typing import Any

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import ReconciliationException
from app.models.bank_record import BankRecord
from app.models.reconciliation_result import (
    ReconciliationDiscrepancyType,
    ReconciliationMatchType,
    ReconciliationResult,
)
from app.models.settlement import Settlement, SettlementStatus
from app.models.transaction import Transaction, TransactionStatus
from app.repositories.reconciliation_repo import ReconciliationRepository
from app.repositories.transaction_repo import TransactionRepository
from app.repositories.settlement_repo import SettlementRepository

logger = structlog.get_logger("services.reconciliation_engine")


class ReconciliationEngine:
    """Multi-source reconciliation engine with configurable matching strategies."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.settings = get_settings()
        self.txn_repo = TransactionRepository(db)
        self.settlement_repo = SettlementRepository(db)
        self.recon_repo = ReconciliationRepository(db)

    async def run_reconciliation(
        self,
        batch_id: str | None = None,
        transaction_ids: list[int] | None = None,
        merchant_id: int | None = None,
    ) -> dict[str, Any]:
        batch_id = batch_id or f"batch_{uuid.uuid4().hex[:12]}"
        logger.info("reconciliation_started", batch_id=batch_id)

        if transaction_ids:
            transactions = []
            for tid in transaction_ids:
                txn = await self.txn_repo.get_by_id(tid)
                if txn:
                    transactions.append(txn)
        else:
            filters = []
            if merchant_id:
                from sqlalchemy import and_
                filters.append(Transaction.merchant_id == merchant_id)
            transactions, _ = await self.txn_repo.list_filtered(
                offset=0, limit=self.settings.RECONCILIATION_BATCH_SIZE
            )

        created = 0
        updated = 0
        for txn in transactions:
            existing = await self.recon_repo.get_by_transaction(txn.id)
            if existing and existing.is_resolved:
                continue

            result = await self._reconcile_single(txn, batch_id)
            if existing:
                existing.internal_status = result["internal_status"]
                existing.gateway_status = result["gateway_status"]
                existing.settlement_status = result["settlement_status"]
                existing.bank_status = result["bank_status"]
                existing.match_type = result["match_type"]
                existing.discrepancy_type = result["discrepancy_type"]
                existing.match_score = result["match_score"]
                existing.discrepancies_json = json.dumps(result["discrepancies"])
                updated += 1
            else:
                recon = ReconciliationResult(
                    transaction_id=txn.id,
                    batch_id=batch_id,
                    internal_status=result["internal_status"],
                    gateway_status=result["gateway_status"],
                    settlement_status=result["settlement_status"],
                    bank_status=result["bank_status"],
                    match_type=result["match_type"],
                    discrepancy_type=result["discrepancy_type"],
                    match_score=result["match_score"],
                    discrepancies_json=json.dumps(result["discrepancies"]),
                )
                self.db.add(recon)
                created += 1

        await self.db.commit()
        summary = await self.recon_repo.get_summary()
        logger.info("reconciliation_completed", batch_id=batch_id, created=created, updated=updated)

        return {
            "batch_id": batch_id,
            "total_transactions": len(transactions),
            "new_results": created,
            "updated_results": updated,
            "summary": summary,
        }

    async def _reconcile_single(self, txn: Transaction, batch_id: str) -> dict:
        settlement = await self.settlement_repo.get_by_transaction(txn.id)

        bank_status = None
        bank_record = None
        if settlement and settlement.bank_ref:
            result = await self.db.execute(
                select(BankRecord).where(BankRecord.bank_ref == settlement.bank_ref)
            )
            bank_record = result.scalar_one_or_none()
            if bank_record:
                bank_status = "matched" if bank_record.is_reconciled else "unmatched"

        gateway_status = txn.status.value
        settlement_status = settlement.status.value if settlement else "no_settlement"

        discrepancies: list[str] = []
        match_type = ReconciliationMatchType.EXACT
        discrepancy_type = ReconciliationDiscrepancyType.MATCH
        match_score = 1.0

        if txn.status in (TransactionStatus.FAILED, TransactionStatus.CANCELLED):
            discrepancy_type = ReconciliationDiscrepancyType.MATCH
            match_score = 1.0
            gateway_status = txn.status.value
        else:
            if not settlement:
                discrepancy_type = ReconciliationDiscrepancyType.MISSING_SETTLEMENT
                match_score = 0.2
                discrepancies.append("No settlement record found")
            else:
                amount_diff = abs(txn.amount - (settlement.net_amount or settlement.amount))
                if amount_diff > self.settings.MATCH_AMOUNT_TOLERANCE:
                    discrepancy_type = ReconciliationDiscrepancyType.AMOUNT_MISMATCH
                    match_score = max(0.1, 1.0 - (amount_diff / max(txn.amount, 1.0)))
                    discrepancies.append(
                        f"Amount mismatch: txn={txn.amount}, settlement={settlement.net_amount or settlement.amount}, diff={round(amount_diff, 2)}"
                    )
                    match_type = ReconciliationMatchType.FUZZY

                if settlement.status == SettlementStatus.PENDING:
                    from datetime import timedelta
                    age = datetime.now(timezone.utc) - (settlement.created_at or datetime.now(timezone.utc))
                    if age > timedelta(days=3):
                        if discrepancy_type == ReconciliationDiscrepancyType.MATCH:
                            discrepancy_type = ReconciliationDiscrepancyType.DELAYED
                            match_score = 0.4
                        discrepancies.append(f"Settlement pending for {age.days} days")

                if settlement.status == SettlementStatus.PARTIALLY_SETTLED:
                    discrepancy_type = ReconciliationDiscrepancyType.PARTIAL_SETTLEMENT
                    match_score = 0.5
                    discrepancies.append("Partial settlement")

            if bank_status == "unmatched" or (settlement and not bank_record):
                if discrepancy_type == ReconciliationDiscrepancyType.MATCH:
                    discrepancy_type = ReconciliationDiscrepancyType.MISSING_BANK
                    match_score = 0.3
                discrepancies.append("Bank confirmation missing or unmatched")

        if txn.status == TransactionStatus.SUCCESS and settlement and settlement.status == SettlementStatus.SETTLED and bank_status == "matched":
            discrepancy_type = ReconciliationDiscrepancyType.MATCH
            match_score = 1.0
            discrepancies = []

        return {
            "internal_status": txn.status.value,
            "gateway_status": gateway_status,
            "settlement_status": settlement_status,
            "bank_status": bank_status,
            "match_type": match_type,
            "discrepancy_type": discrepancy_type,
            "match_score": round(match_score, 4),
            "discrepancies": discrepancies,
        }

    async def detect_duplicates(self, batch_size: int = 500) -> list[dict]:
        duplicate_records = []

        result = await self.db.execute(
            select(Transaction)
            .where(Transaction.status == TransactionStatus.SUCCESS)
            .order_by(Transaction.created_at.desc())
            .limit(batch_size)
        )
        transactions = list(result.scalars().all())

        seen: dict[tuple, list[Transaction]] = {}
        for txn in transactions:
            key = (txn.merchant_id, round(txn.amount, 2), txn.currency, txn.gateway_id)
            seen.setdefault(key, []).append(txn)

        for key, txns in seen.items():
            if len(txns) > 1:
                time_diffs = []
                for i in range(len(txns) - 1):
                    diff = abs((txns[i].created_at - txns[i + 1].created_at).total_seconds())
                    time_diffs.append(diff)

                min_diff = min(time_diffs) if time_diffs else float("inf")
                if min_diff <= self.settings.FRAUD_DUPLICATE_WINDOW_SECONDS:
                    for txn in txns:
                        duplicate_records.append({
                            "transaction_id": txn.id,
                            "transaction_ref": txn.transaction_ref,
                            "amount": txn.amount,
                            "merchant_id": txn.merchant_id,
                            "duplicate_count": len(txns),
                            "time_diff_seconds": min_diff,
                        })

        return duplicate_records

    async def detect_missing_gateway_records(self) -> list[dict]:
        result = await self.db.execute(
            select(Transaction).where(
                Transaction.status == TransactionStatus.SUCCESS,
                Transaction.gateway_transaction_id.is_(None),
            )
        )
        missing = list(result.scalars().all())
        return [
            {
                "transaction_id": txn.id,
                "transaction_ref": txn.transaction_ref,
                "amount": txn.amount,
                "merchant_id": txn.merchant_id,
            }
            for txn in missing
        ]

    async def get_accuracy_metrics(self) -> dict:
        all_results = (await self.db.execute(select(ReconciliationResult))).scalars().all()
        if not all_results:
            return {"total": 0, "accuracy_pct": 0.0, "avg_confidence": 0.0, "auto_resolved_pct": 0.0}

        total = len(all_results)
        matched = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.MATCH)
        avg_score = sum(r.match_score for r in all_results) / total
        auto_resolved = sum(1 for r in all_results if r.is_resolved and r.match_score >= 0.9)

        by_type: dict[str, int] = {}
        for r in all_results:
            t = r.discrepancy_type.value if hasattr(r.discrepancy_type, "value") else str(r.discrepancy_type)
            by_type[t] = by_type.get(t, 0) + 1

        return {
            "total": total,
            "accuracy_pct": round(matched / total * 100, 2),
            "avg_confidence": round(avg_score, 4),
            "auto_resolved_pct": round(auto_resolved / total * 100, 2) if total else 0,
            "by_type": by_type,
        }


async def run_reconciliation(db: AsyncSession, batch_id: str | None = None) -> dict:
    engine = ReconciliationEngine(db)
    return await engine.run_reconciliation(batch_id=batch_id)


async def list_results(db: AsyncSession, page: int = 1, size: int = 20, discrepancy_type: str | None = None) -> tuple[list[ReconciliationResult], int]:
    repo = ReconciliationRepository(db)
    return await repo.list_filtered(offset=(page - 1) * size, limit=size, discrepancy_type=discrepancy_type)


async def get_result(db: AsyncSession, result_id: int) -> ReconciliationResult:
    repo = ReconciliationRepository(db)
    result = await repo.get_by_id(result_id)
    if not result:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("ReconciliationResult", result_id)
    return result


async def resolve_result(db: AsyncSession, result_id: int, resolved_by: str) -> ReconciliationResult:
    from datetime import datetime, timezone
    recon = await get_result(db, result_id)
    recon.is_resolved = True
    recon.resolved_by = resolved_by
    recon.resolved_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(recon)
    return recon


async def get_summary(db: AsyncSession) -> dict:
    repo = ReconciliationRepository(db)
    return await repo.get_summary()
