from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.transaction import TransactionStatus


class TransactionBase(BaseModel):
    transaction_ref: str = Field(..., min_length=1, max_length=64)
    gateway_name: str = Field(..., min_length=1, max_length=50)
    merchant_reference: str | None = Field(default=None, max_length=64)
    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR", min_length=3, max_length=3)
    status: TransactionStatus = TransactionStatus.PENDING
    description: str | None = Field(default=None, max_length=255)


class TransactionCreate(TransactionBase):
    pass


class TransactionRead(TransactionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class TransactionListResponse(BaseModel):
    items: list[TransactionRead]
    total: int
