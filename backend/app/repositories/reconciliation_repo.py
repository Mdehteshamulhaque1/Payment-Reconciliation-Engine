from sqlalchemy import func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.reconciliation_result import ReconciliationResult, ReconciliationDiscrepancyType


class ReconciliationRepository(BaseRepository[ReconciliationResult]):
    def __init__(self, db: AsyncSession):
        super().__init__(ReconciliationResult, db)

    async def get_by_transaction(self, transaction_id: int) -> ReconciliationResult | None:
        result = await self.db.execute(
            select(ReconciliationResult).where(ReconciliationResult.transaction_id == transaction_id)
        )
        return result.scalar_one_or_none()

    async def get_by_batch(self, batch_id: str) -> list[ReconciliationResult]:
        result = await self.db.execute(
            select(ReconciliationResult)
            .where(ReconciliationResult.batch_id == batch_id)
            .order_by(ReconciliationResult.created_at.desc())
        )
        return list(result.scalars().all())

    async def list_filtered(
        self,
        offset: int = 0,
        limit: int = 20,
        discrepancy_type: str | None = None,
        is_resolved: bool | None = None,
        batch_id: str | None = None,
        min_score: float | None = None,
    ) -> tuple[list[ReconciliationResult], int]:
        query = select(ReconciliationResult)
        count_query = select(func.count(ReconciliationResult.id))
        filters = []
        if discrepancy_type:
            filters.append(ReconciliationResult.discrepancy_type == discrepancy_type)
        if is_resolved is not None:
            filters.append(ReconciliationResult.is_resolved == is_resolved)
        if batch_id:
            filters.append(ReconciliationResult.batch_id == batch_id)
        if min_score is not None:
            filters.append(ReconciliationResult.match_score >= min_score)

        for f in filters:
            query = query.where(f)
            count_query = count_query.where(f)

        total = (await self.db.execute(count_query)).scalar() or 0
        query = query.order_by(ReconciliationResult.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def get_summary(self) -> dict:
        all_results = (await self.db.execute(select(ReconciliationResult))).scalars().all()
        total = len(all_results)
        if total == 0:
            return {"total": 0, "matched": 0, "mismatches": 0, "missing": 0, "duplicates": 0, "accuracy_pct": 0.0}

        matched = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.MATCH)
        mismatches = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.AMOUNT_MISMATCH)
        missing_internal = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.MISSING_INTERNAL)
        missing_gateway = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.MISSING_GATEWAY)
        missing_settlement = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.MISSING_SETTLEMENT)
        missing_bank = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.MISSING_BANK)
        duplicates = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.DUPLICATE)
        partial = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.PARTIAL_SETTLEMENT)
        delayed = sum(1 for r in all_results if r.discrepancy_type == ReconciliationDiscrepancyType.DELAYED)
        avg_score = sum(r.match_score for r in all_results) / total if total else 0

        return {
            "total": total,
            "total_checked": total,
            "matched": matched,
            "mismatches": mismatches,
            "missing": missing_internal + missing_gateway + missing_settlement + missing_bank,
            "missing_internal": missing_internal,
            "missing_gateway": missing_gateway,
            "missing_settlement": missing_settlement,
            "missing_bank": missing_bank,
            "duplicates": duplicates,
            "partial_settlement": partial,
            "delayed": delayed,
            "accuracy_pct": round(matched / total * 100, 2) if total > 0 else 0.0,
            "accuracy": round(matched / total * 100, 2) if total > 0 else 0.0,
            "avg_match_score": round(avg_score, 4),
        }

    async def delete_by_batch(self, batch_id: str) -> int:
        from sqlalchemy import delete
        result = await self.db.execute(
            delete(ReconciliationResult).where(ReconciliationResult.batch_id == batch_id)
        )
        return result.rowcount
