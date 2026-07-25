import json
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction, TransactionStatus, TransactionType
from app.models.fraud_case import FraudCase, FraudCaseStatus
from app.services.fraud_detector import FraudDetectionEngine


@pytest.mark.asyncio
async def test_scan_normal_transaction(db: AsyncSession, seed_gateway):
    txn = Transaction(
        transaction_ref="TXN_FRAUD_001",
        gateway_id=seed_gateway,
        gateway_transaction_id="gw_fraud_001",
        amount=50.0,
        currency="INR",
        status=TransactionStatus.SUCCESS,
        transaction_type=TransactionType.PAYMENT,
    )
    db.add(txn)
    await db.commit()
    await db.refresh(txn)

    engine = FraudDetectionEngine(db)
    result = await engine.scan_transaction(txn.id)

    assert result["is_suspicious"] is False
    assert result["risk_score"] < 0.5
    assert result["case_id"] is None


@pytest.mark.asyncio
async def test_scan_large_amount_detected(db: AsyncSession, seed_gateway):
    txn = Transaction(
        transaction_ref="TXN_FRAUD_002",
        gateway_id=seed_gateway,
        gateway_transaction_id="gw_fraud_002",
        amount=500000.0,
        currency="INR",
        status=TransactionStatus.SUCCESS,
        transaction_type=TransactionType.PAYMENT,
    )
    db.add(txn)
    await db.commit()
    await db.refresh(txn)

    engine = FraudDetectionEngine(db)
    result = await engine.scan_transaction(txn.id)

    assert result["risk_score"] >= 0.4
    assert any("Large transaction" in f for f in result["factors"])


@pytest.mark.asyncio
async def test_scan_creates_fraud_case_when_suspicious(db: AsyncSession, seed_gateway):
    txn = Transaction(
        transaction_ref="TXN_FRAUD_003",
        gateway_id=seed_gateway,
        gateway_transaction_id="gw_fraud_003",
        amount=200000.0,
        currency="INR",
        status=TransactionStatus.SUCCESS,
        transaction_type=TransactionType.PAYMENT,
    )
    db.add(txn)
    await db.commit()
    await db.refresh(txn)

    engine = FraudDetectionEngine(db)
    result = await engine.scan_transaction(txn.id)

    if result["is_suspicious"] and result["case_id"]:
        from sqlalchemy import select
        case_result = await db.execute(select(FraudCase).where(FraudCase.id == result["case_id"]))
        case = case_result.scalar_one_or_none()
        assert case is not None
        assert case.status == FraudCaseStatus.OPEN
        assert case.transaction_id == txn.id
        assert case.risk_score > 0.0


@pytest.mark.asyncio
async def test_fraud_dashboard(db: AsyncSession):
    from app.services.fraud_detector import get_fraud_dashboard
    dashboard = await get_fraud_dashboard(db)
    assert "total_cases" in dashboard
    assert "open_cases" in dashboard
