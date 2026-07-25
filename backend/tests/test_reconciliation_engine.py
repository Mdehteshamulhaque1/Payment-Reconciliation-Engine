import json
import pytest
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.transaction import Transaction, TransactionStatus, TransactionType
from app.models.settlement import Settlement, SettlementStatus
from app.models.reconciliation_result import ReconciliationDiscrepancyType, ReconciliationResult
from app.services.reconciliation_engine import ReconciliationEngine


@pytest.mark.asyncio
async def test_reconcile_exact_match(db: AsyncSession, seed_gateway):
    txn = Transaction(
        transaction_ref="TXN_TEST_001",
        gateway_id=seed_gateway,
        gateway_transaction_id="gw_txn_001",
        amount=1000.0,
        currency="INR",
        status=TransactionStatus.SUCCESS,
        transaction_type=TransactionType.PAYMENT,
    )
    db.add(txn)
    await db.flush()

    settlement = Settlement(
        transaction_id=txn.id,
        gateway_id=seed_gateway,
        amount=1000.0,
        net_amount=1000.0,
        currency="INR",
        status=SettlementStatus.SETTLED,
        settlement_date=datetime.now(timezone.utc),
        bank_ref="BANK_001",
    )
    db.add(settlement)
    await db.commit()

    from app.models.bank_record import BankRecord
    bank = BankRecord(
        bank_ref="BANK_001",
        amount=1000.0,
        currency="INR",
        transaction_date=datetime.now(timezone.utc),
        description="Test bank record",
        is_reconciled=True,
    )
    db.add(bank)
    await db.commit()

    engine = ReconciliationEngine(db)
    result = await engine.run_reconciliation(batch_id="test_batch_001")

    assert result["total_transactions"] >= 1
    assert result["batch_id"] == "test_batch_001"

    recon_result = await db.execute(
        select(ReconciliationResult).where(ReconciliationResult.transaction_id == txn.id)
    )
    recon = recon_result.scalar_one_or_none()
    assert recon is not None
    assert recon.discrepancy_type == ReconciliationDiscrepancyType.MATCH
    assert recon.match_score == 1.0


@pytest.mark.asyncio
async def test_reconcile_amount_mismatch(db: AsyncSession, seed_gateway):
    txn = Transaction(
        transaction_ref="TXN_TEST_002",
        gateway_id=seed_gateway,
        gateway_transaction_id="gw_txn_002",
        amount=2000.0,
        currency="INR",
        status=TransactionStatus.SUCCESS,
        transaction_type=TransactionType.PAYMENT,
    )
    db.add(txn)
    await db.flush()

    settlement = Settlement(
        transaction_id=txn.id,
        gateway_id=seed_gateway,
        amount=1950.0,
        net_amount=1950.0,
        currency="INR",
        status=SettlementStatus.SETTLED,
    )
    db.add(settlement)
    await db.commit()

    engine = ReconciliationEngine(db)
    result = await engine.run_reconciliation(batch_id="test_batch_002")

    recon_result = await db.execute(
        select(ReconciliationResult).where(ReconciliationResult.transaction_id == txn.id)
    )
    recon = recon_result.scalar_one_or_none()
    assert recon is not None
    assert recon.discrepancy_type == ReconciliationDiscrepancyType.AMOUNT_MISMATCH
    assert recon.match_score < 1.0


@pytest.mark.asyncio
async def test_reconcile_missing_settlement(db: AsyncSession, seed_gateway):
    txn = Transaction(
        transaction_ref="TXN_TEST_003",
        gateway_id=seed_gateway,
        gateway_transaction_id="gw_txn_003",
        amount=500.0,
        currency="INR",
        status=TransactionStatus.SUCCESS,
        transaction_type=TransactionType.PAYMENT,
    )
    db.add(txn)
    await db.commit()

    engine = ReconciliationEngine(db)
    result = await engine.run_reconciliation(batch_id="test_batch_003")

    recon_result = await db.execute(
        select(ReconciliationResult).where(ReconciliationResult.transaction_id == txn.id)
    )
    recon = recon_result.scalar_one_or_none()
    assert recon is not None
    assert recon.discrepancy_type == ReconciliationDiscrepancyType.MISSING_SETTLEMENT
    assert recon.match_score < 0.5


@pytest.mark.asyncio
async def test_reconcile_failed_transaction_is_match(db: AsyncSession, seed_gateway):
    txn = Transaction(
        transaction_ref="TXN_TEST_004",
        gateway_id=seed_gateway,
        gateway_transaction_id="gw_txn_004",
        amount=100.0,
        currency="INR",
        status=TransactionStatus.FAILED,
        transaction_type=TransactionType.PAYMENT,
    )
    db.add(txn)
    await db.commit()

    engine = ReconciliationEngine(db)
    result = await engine.run_reconciliation(batch_id="test_batch_004")

    recon_result = await db.execute(
        select(ReconciliationResult).where(ReconciliationResult.transaction_id == txn.id)
    )
    recon = recon_result.scalar_one_or_none()
    assert recon is not None
    assert recon.discrepancy_type == ReconciliationDiscrepancyType.MATCH
    assert recon.match_score == 1.0


@pytest.mark.asyncio
async def test_accuracy_metrics(db: AsyncSession, seed_gateway):
    engine = ReconciliationEngine(db)
    metrics = await engine.get_accuracy_metrics()
    assert "total" in metrics
    assert "accuracy_pct" in metrics
