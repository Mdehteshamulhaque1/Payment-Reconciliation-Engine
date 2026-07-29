import json
from typing import Any

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction

logger = structlog.get_logger("services.ml.graph_analyzer")


class GraphAnalyzer:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def analyze_transaction(self, txn: Transaction) -> dict[str, Any]:
        if not txn.customer_id or not txn.merchant_id:
            return {"graph_risk": 0.0, "indicators": []}

        shared_customers = await self._get_shared_customers(txn)
        shared_merchants = await self._get_shared_merchants(txn)
        density = await self._get_connection_density(txn)

        indicators = []
        risk = 0.0

        if len(shared_customers) > 3:
            indicators.append({
                "type": "shared_customers",
                "detail": f"Merchant {txn.merchant_id} shares {len(shared_customers)} customers with suspicious merchants",
                "risk": min(0.5, len(shared_customers) * 0.05),
            })

        if len(shared_merchants) > 5:
            indicators.append({
                "type": "shared_merchants",
                "detail": f"Customer {txn.customer_id} transacts with {len(shared_merchants)} different merchants",
                "risk": min(0.4, len(shared_merchants) * 0.02),
            })

        if density > 0.3:
            indicators.append({
                "type": "high_density",
                "detail": f"Connection density {density:.2f} suggests tight-knit transaction cluster",
                "risk": min(0.6, density * 1.5),
            })

        for ind in indicators:
            risk = max(risk, ind["risk"])

        return {"graph_risk": round(risk, 4), "indicators": indicators}

    async def _get_shared_customers(self, txn: Transaction) -> list[int]:
        fraud_txns = await self.db.execute(
            select(Transaction.customer_id).distinct().where(
                Transaction.merchant_id == txn.merchant_id,
                Transaction.customer_id.isnot(None),
            ).limit(50)
        )
        all_customers = [row[0] for row in fraud_txns.all() if row[0] != txn.customer_id]
        return all_customers[:20]

    async def _get_shared_merchants(self, txn: Transaction) -> list[int]:
        merchant_txns = await self.db.execute(
            select(Transaction.merchant_id).distinct().where(
                Transaction.customer_id == txn.customer_id,
                Transaction.merchant_id.isnot(None),
            ).limit(50)
        )
        all_merchants = [row[0] for row in merchant_txns.all() if row[0] != txn.merchant_id]
        return all_merchants[:20]

    async def _get_connection_density(self, txn: Transaction) -> float:
        shared_customers = await self._get_shared_customers(txn)
        if not shared_customers:
            return 0.0

        shared_merchants = await self._get_shared_merchants(txn)
        if not shared_merchants:
            return 0.0

        overlap = 0
        for cust_id in shared_customers[:10]:
            for merch_id in shared_merchants[:10]:
                result = await self.db.execute(
                    select(Transaction).where(
                        Transaction.customer_id == cust_id,
                        Transaction.merchant_id == merch_id,
                    ).limit(1)
                )
                if result.scalar_one_or_none():
                    overlap += 1

        total_possible = len(shared_customers[:10]) * len(shared_merchants[:10])
        return overlap / total_possible if total_possible > 0 else 0.0

    async def find_fraud_rings(self) -> list[dict[str, Any]]:
        txns = await self.db.execute(
            select(Transaction).where(
                Transaction.customer_id.isnot(None),
                Transaction.merchant_id.isnot(None),
            ).limit(500)
        )
        all_txns = list(txns.scalars().all())

        customer_merchant: dict[int, set[int]] = {}
        for t in all_txns:
            if t.customer_id:
                if t.customer_id not in customer_merchant:
                    customer_merchant[t.customer_id] = set()
                if t.merchant_id:
                    customer_merchant[t.customer_id].add(t.merchant_id)

        rings = []
        checked = set()
        for cust_id, merchants in customer_merchant.items():
            if cust_id in checked or len(merchants) < 3:
                continue
            checked.add(cust_id)
            ring_members = [cust_id]
            for other_id, other_merchants in customer_merchant.items():
                if other_id not in checked and len(merchants & other_merchants) >= 2:
                    ring_members.append(other_id)
                    checked.add(other_id)
            if len(ring_members) >= 3:
                rings.append({
                    "customer_ids": ring_members,
                    "shared_merchants": list(merchants),
                    "size": len(ring_members),
                    "risk": round(min(0.8, len(ring_members) * 0.1), 4),
                })

        logger.info("fraud_ring_scan", rings_found=len(rings))
        return rings
