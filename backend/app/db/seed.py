"""Database seed script — populates the database with demo data.

Creates a default admin user, sample transactions across all statuses,
settlements, ledger entries, reconciliation results, fraud cases,
notifications, and reports for development and demonstration purposes.

Usage:
    python -m app.db.seed
"""

import asyncio
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select

from app.db.base import Base, engine, async_session_factory
from app.db.session import import_all_models
from app.core.security import get_password_hash

from app.models.user import User
from app.models.transaction import Transaction, TransactionStatus, TransactionType
from app.models.settlement import Settlement, SettlementStatus
from app.models.reconciliation_result import ReconciliationResult, ReconciliationDiscrepancyType, ReconciliationMatchType
from app.models.fraud_case import FraudCase, FraudCaseStatus, FraudType
from app.models.ledger_entry import LedgerEntry, LedgerEntryType
from app.models.notification import Notification, NotificationChannel, NotificationStatus
from app.models.report import Report, ReportStatus, ReportType


async def seed_all():
    import_all_models()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as db:
        # ── 1. Default admin user ──
        result = await db.execute(select(User).where(User.email == "qwerty123@gmail.com"))
        existing = result.scalar_one_or_none()
        if not existing:
            old = await db.execute(select(User).where(User.email == "ethethamulhaque736@gmail.com"))
            old_user = old.scalar_one_or_none()
            if old_user:
                old_user.email = "qwerty123@gmail.com"
                old_user.hashed_password = get_password_hash("12345@123")
                old_user.full_name = "Admin User"
                await db.flush()
                admin_id = old_user.id
            else:
                admin = User(
                    email="qwerty123@gmail.com",
                    hashed_password=get_password_hash("12345@123"),
                    full_name="Admin User",
                    is_active=True,
                    is_superuser=True,
                    is_verified=True,
                )
                db.add(admin)
                await db.flush()
                admin_id = admin.id
        else:
            admin_id = existing.id

        # ── 2. Seed transactions ──
        txn_count = (await db.execute(select(func.count(Transaction.id)))).scalar() or 0
        if txn_count == 0:
            statuses = [
                TransactionStatus.SUCCESS, TransactionStatus.PENDING, TransactionStatus.FAILED,
                TransactionStatus.RECONCILED, TransactionStatus.REFUNDED, TransactionStatus.SUCCESS,
                TransactionStatus.PENDING, TransactionStatus.SUCCESS, TransactionStatus.FAILED,
                TransactionStatus.SUCCESS, TransactionStatus.SUCCESS, TransactionStatus.PENDING,
                TransactionStatus.SUCCESS, TransactionStatus.RECONCILED, TransactionStatus.SUCCESS,
                TransactionStatus.FAILED, TransactionStatus.SUCCESS, TransactionStatus.PENDING,
                TransactionStatus.SUCCESS, TransactionStatus.SUCCESS,
            ]
            descriptions = [
                "Subscription renewal", "Product checkout", "Invoice payment",
                "Enterprise plan", "Refund processed", "API usage billing",
                "Starter plan purchase", "Annual subscription", "Failed retry attempt",
                "Payment gateway test", "Customer onboarding", "Trial conversion",
                "Premium upgrade", "Bulk order payment", "Recurring billing",
                "Timeout error", "Successful transfer", "Pending verification",
                "Subscription renewal v2", "Enterprise upgrade",
            ]
            amounts = [
                2499, 799, 12999, 49999, 1500, 899,
                3999, 24999, 599, 1999, 4500, 2999,
                14999, 89999, 3499, 1200, 7999, 1999,
                5999, 34999,
            ]
            gateways = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]

            for i in range(20):
                now = datetime.now(timezone.utc)
                created = now - timedelta(days=20 - i, hours=i * 3 % 12)
                failure = "Insufficient funds" if statuses[i] == TransactionStatus.FAILED else None
                txn = Transaction(
                    transaction_ref=f"TXN-{1000 + i:04d}",
                    gateway_id=gateways[i],
                    amount=amounts[i],
                    currency="INR",
                    status=statuses[i],
                    transaction_type=TransactionType.PAYMENT,
                    description=descriptions[i],
                    failure_reason=failure,
                    created_at=created,
                    updated_at=created,
                )
                db.add(txn)
            await db.flush()

            # ── 3. Settlements for successful transactions ──
            success_txns = (await db.execute(
                select(Transaction).where(Transaction.status.in_([
                    TransactionStatus.SUCCESS, TransactionStatus.RECONCILED
                ]))
            )).scalars().all()

            for txn in success_txns[:12]:
                fee = round(txn.amount * 0.02, 2)
                statuses_list = [SettlementStatus.SETTLED, SettlementStatus.PENDING, SettlementStatus.PENDING]
                s_status = statuses_list[txn.id % 3]
                settlement = Settlement(
                    transaction_id=txn.id,
                    gateway_id=txn.gateway_id,
                    amount=txn.amount,
                    currency=txn.currency,
                    status=s_status,
                    fee=fee,
                    net_amount=round(txn.amount - fee, 2),
                )
                db.add(settlement)

            # ── 4. Ledger entries ──
            for txn in success_txns[:10]:
                db.add(LedgerEntry(
                    account="payment_processing",
                    transaction_id=txn.id,
                    entry_type=LedgerEntryType.DEBIT,
                    amount=txn.amount,
                    currency=txn.currency,
                    balance_after=-txn.amount * (txn.id % 3 + 1),
                    description=f"Payment from TXN-{txn.id:04d}",
                ))
                db.add(LedgerEntry(
                    account="revenue",
                    transaction_id=txn.id,
                    entry_type=LedgerEntryType.CREDIT,
                    amount=txn.amount,
                    currency=txn.currency,
                    balance_after=txn.amount * (txn.id % 5 + 1),
                    description=f"Revenue from TXN-{txn.id:04d}",
                ))

            # ── 5. Reconciliation results ──
            for txn in success_txns[:8]:
                db.add(ReconciliationResult(
                    transaction_id=txn.id,
                    internal_status=txn.status.value,
                    gateway_status="captured",
                    settlement_status="settled",
                    match_type=ReconciliationMatchType.EXACT,
                    discrepancy_type=ReconciliationDiscrepancyType.MATCH,
                    match_score=0.95,
                ))

            # ── 6. Fraud cases ──
            fraud_txns = (await db.execute(
                select(Transaction).where(Transaction.amount > 50000)
            )).scalars().all()

            for txn in fraud_txns[:3]:
                db.add(FraudCase(
                    transaction_id=txn.id,
                    fraud_type=FraudType.LARGE_TRANSACTION,
                    risk_score=0.75,
                    status=FraudCaseStatus.OPEN,
                ))

            # ── 7. Notifications ──
            notif_subjects = [
                ("System startup complete", "All services initialized successfully"),
                ("New fraud alert detected", "High-value transaction flagged for review"),
                ("Settlement batch processed", "12 settlements processed successfully"),
                ("Gateway health warning", "Stripe gateway latency above threshold"),
                ("Daily reconciliation complete", "All transactions reconciled"),
            ]
            for subj, body in notif_subjects:
                db.add(Notification(
                    user_id=admin_id,
                    channel=NotificationChannel.IN_APP,
                    subject=subj,
                    body=body,
                    status=NotificationStatus.PENDING,
                ))

            # ── 8. Reports ──
            report_data = [
                ("Daily Transaction Summary", ReportType.TRANSACTION),
                ("Weekly Settlement Report", ReportType.SETTLEMENT),
                ("Monthly Reconciliation Audit", ReportType.RECONCILIATION),
                ("Fraud Detection Report", ReportType.FRAUD),
                ("Gateway Performance Analysis", ReportType.GATEWAY),
            ]
            for name, rtype in report_data:
                db.add(Report(
                    name=name,
                    report_type=rtype,
                    format="csv",
                    status=ReportStatus.COMPLETED,
                    created_by=admin_id,
                ))

            await db.commit()
            print("Seeded: user, 20 transactions, settlements, ledger, reconciliation, fraud, notifications, reports")
        else:
            await db.commit()
            print(f"Database already has {txn_count} transactions, skipping seed")


if __name__ == "__main__":
    asyncio.run(seed_all())
