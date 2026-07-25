from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction, TransactionStatus
from app.models.settlement import Settlement, SettlementStatus
from app.models.reconciliation_result import ReconciliationResult, ReconciliationDiscrepancyType
from app.models.fraud_case import FraudCase, FraudCaseStatus
from app.models.payment_gateway import PaymentGateway
from app.models.gateway_health import GatewayHealth


async def get_dashboard(db: AsyncSession) -> dict:
    txn_total = (await db.execute(select(func.count(Transaction.id)))).scalar() or 0
    txn_amount = (await db.execute(select(func.coalesce(func.sum(Transaction.amount), 0)))).scalar() or 0
    txn_success = (await db.execute(select(func.count(Transaction.id)).where(Transaction.status == TransactionStatus.SUCCESS))).scalar() or 0
    success_rate = round(txn_success / txn_total * 100, 2) if txn_total > 0 else 0.0

    settlement_total = (await db.execute(select(func.count(Settlement.id)))).scalar() or 0
    settlement_pending = (await db.execute(select(func.count(Settlement.id)).where(Settlement.status == SettlementStatus.PENDING))).scalar() or 0

    recon_total = (await db.execute(select(func.count(ReconciliationResult.id)))).scalar() or 0
    recon_matched = (await db.execute(select(func.count(ReconciliationResult.id)).where(ReconciliationResult.discrepancy_type == ReconciliationDiscrepancyType.MATCH))).scalar() or 0
    recon_accuracy = round(recon_matched / recon_total * 100, 2) if recon_total > 0 else 0.0

    fraud_total = (await db.execute(select(func.count(FraudCase.id)))).scalar() or 0
    active_gateways = (await db.execute(select(func.count(PaymentGateway.id)).where(PaymentGateway.is_active == True))).scalar() or 0

    return {
        "total_transactions": txn_total,
        "total_amount": round(float(txn_amount), 2),
        "success_rate": success_rate,
        "total_settlements": settlement_total,
        "pending_settlements": settlement_pending,
        "reconciliation_accuracy": recon_accuracy,
        "fraud_cases": fraud_total,
        "active_gateways": active_gateways,
    }


async def get_gateway_comparison(db: AsyncSession) -> list[dict]:
    result = await db.execute(select(PaymentGateway).where(PaymentGateway.is_active == True))
    gateways = result.scalars().all()

    comparison = []
    for gw in gateways:
        txn_result = await db.execute(
            select(
                func.count(Transaction.id),
                func.coalesce(func.sum(Transaction.amount), 0),
            ).where(Transaction.gateway_id == gw.id)
        )
        row = txn_result.one()
        total = row[0] or 0
        amount = row[1] or 0

        success = (await db.execute(
            select(func.count(Transaction.id)).where(
                Transaction.gateway_id == gw.id, Transaction.status == TransactionStatus.SUCCESS
            )
        )).scalar() or 0

        health_result = await db.execute(
            select(func.avg(GatewayHealth.latency_ms)).where(GatewayHealth.gateway_id == gw.id)
        )
        avg_latency = health_result.scalar() or 0.0

        comparison.append({
            "gateway_name": gw.name,
            "total_transactions": total,
            "success_rate": round(success / total * 100, 2) if total > 0 else 0.0,
            "avg_latency_ms": round(float(avg_latency), 2),
            "total_amount": round(float(amount), 2),
        })

    return comparison


async def get_top_failures(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        select(Transaction.failure_reason, func.count(Transaction.id).label("cnt"))
        .where(Transaction.status == TransactionStatus.FAILED, Transaction.failure_reason.isnot(None))
        .group_by(Transaction.failure_reason)
        .order_by(func.count(Transaction.id).desc())
        .limit(10)
    )
    rows = result.all()

    total_failures = sum(r[1] for r in rows)
    return [
        {"reason": r[0], "count": r[1], "percentage": round(r[1] / total_failures * 100, 2) if total_failures > 0 else 0}
        for r in rows
    ]
