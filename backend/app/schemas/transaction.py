from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.transaction import TransactionStatus, TransactionType


class TransactionCreate(BaseModel):
    transaction_ref: str = Field(..., min_length=1, max_length=64)
    merchant_id: int | None = None
    customer_id: int | None = None
    gateway_id: int | None = None
    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR", min_length=3, max_length=3)
    transaction_type: TransactionType = TransactionType.PAYMENT
    description: str | None = Field(default=None, max_length=500)
    idempotency_key: str | None = Field(default=None, max_length=128)
    metadata_json: str | None = None


class TransactionUpdate(BaseModel):
    amount: float | None = Field(default=None, gt=0)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    description: str | None = None
    metadata_json: str | None = None


class TransactionStatusUpdate(BaseModel):
    status: TransactionStatus
    reason: str | None = Field(default=None, max_length=500)
    actor: str | None = Field(default=None, max_length=100)


class TransactionRefundRequest(BaseModel):
    amount: float | None = Field(default=None, gt=0, description="Partial refund amount, or None for full")
    reason: str | None = Field(default=None, max_length=500)


class TransactionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    transaction_ref: str
    merchant_id: int | None
    customer_id: int | None
    gateway_id: int | None
    gateway_transaction_id: str | None
    amount: float
    currency: str
    status: TransactionStatus
    transaction_type: TransactionType
    description: str | None
    idempotency_key: str | None
    failure_reason: str | None
    retry_count: int
    created_at: datetime
    updated_at: datetime


class TransactionListResponse(BaseModel):
    items: list[TransactionOut]
    total: int
    page: int
    size: int
    pages: int


class TransactionEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    transaction_id: int
    from_status: str | None
    to_status: str
    reason: str | None
    actor: str | None
    created_at: datetime


class TransactionStats(BaseModel):
    total: int = 0
    pending: int = 0
    success: int = 0
    failed: int = 0
    refunded: int = 0
    reconciled: int = 0
    total_amount: float = 0.0
    success_rate: float = 0.0


class BulkTransactionItem(BaseModel):
    transaction_ref: str
    amount: float = Field(..., gt=0)
    currency: str = "INR"
    gateway_name: str | None = None
    merchant_id: int | None = None
    description: str | None = None


class BulkTransactionRequest(BaseModel):
    transactions: list[BulkTransactionItem] = Field(..., min_length=1, max_length=100)
