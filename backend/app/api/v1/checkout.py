import random
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.models.transaction import Transaction, TransactionStatus
from app.models.transaction_event import TransactionEvent
from app.infrastructure.gateways.registry import get_gateway_simulator, list_available_gateways

router = APIRouter(prefix="/checkout", tags=["Checkout"])


class TrialCheckoutRequest(BaseModel):
    plan: str = Field(default="Starter", min_length=1, max_length=50)
    gateway: str = Field(default="stripe", min_length=1, max_length=50)
    amount: float = Field(default=1.0, gt=0)
    currency: str = Field(default="INR", min_length=3, max_length=3)


class TrialCheckoutResponse(BaseModel):
    success: bool
    transaction_id: int
    transaction_ref: str
    gateway: str
    gateway_transaction_id: str | None = None
    amount: float
    currency: str
    status: str
    message: str


@router.post("/trial", response_model=TrialCheckoutResponse, summary="Start free trial with ₹1 payment")
async def trial_checkout(
    payload: TrialCheckoutRequest,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_active_user),
) -> TrialCheckoutResponse:
    if payload.gateway not in list_available_gateways():
        raise HTTPException(status_code=400, detail=f"Unsupported gateway '{payload.gateway}'. Available: {list_available_gateways()}")

    txn_ref = f"TRIAL-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"

    transaction = Transaction(
        transaction_ref=txn_ref,
        amount=payload.amount,
        currency=payload.currency,
        transaction_type="payment",
        description=f"Free trial activation — {payload.plan} plan",
        status=TransactionStatus.PROCESSING,
    )
    db.add(transaction)
    await db.flush()

    simulator = get_gateway_simulator(payload.gateway)
    result = simulator.process_payment(payload.amount, payload.currency)

    if result.success:
        transaction.status = TransactionStatus.SUCCESS
        transaction.gateway_transaction_id = result.gateway_transaction_id
        message = "Payment successful! Your trial is activated."
    else:
        transaction.status = TransactionStatus.FAILED
        message = result.error_message or "Payment failed. Please try again."

    event = TransactionEvent(
        transaction_id=transaction.id,
        from_status=None,
        to_status=transaction.status.value,
        reason=message,
        actor="system",
    )
    db.add(event)
    await db.commit()
    await db.refresh(transaction)

    return TrialCheckoutResponse(
        success=result.success,
        transaction_id=transaction.id,
        transaction_ref=txn_ref,
        gateway=payload.gateway,
        gateway_transaction_id=result.gateway_transaction_id,
        amount=payload.amount,
        currency=payload.currency,
        status=transaction.status.value,
        message=message,
    )
