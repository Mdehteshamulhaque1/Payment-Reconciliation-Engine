from pydantic import BaseModel, ConfigDict, Field, model_validator
from datetime import datetime


class SettlementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    transaction_id: int
    gateway_id: int | None
    amount: float
    currency: str
    status: str
    settlement_date: datetime | None
    batch_ref: str | None
    bank_ref: str | None
    fee: float
    net_amount: float
    created_at: datetime


class SettlementListResponse(BaseModel):
    items: list[SettlementOut]
    settlements: list[SettlementOut] = []
    total: int


class SettlementSummary(BaseModel):
    total: int
    count: int = 0
    pending: int
    pending_count: int = 0
    settled: int
    failed: int
    disputed_count: int = 0
    total_amount: float
    total_settled: float
    total_fees: float


class BankRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    bank_ref: str
    settlement_id: int | None
    amount: float
    currency: str
    transaction_date: datetime
    is_reconciled: bool
    created_at: datetime


class LedgerEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    account: str
    account_name: str = ""
    transaction_id: int
    entry_type: str
    type: str = ""
    amount: float
    currency: str
    balance_after: float
    description: str | None
    reference: str | None
    created_at: datetime

    @model_validator(mode='after')
    def compute_fields(self):
        self.type = self.entry_type
        self.account_name = self.account
        return self


class LedgerEntryListResponse(BaseModel):
    items: list[LedgerEntryOut]
    total: int


class LedgerBalanceOut(BaseModel):
    account: str
    balance: float
    currency: str
    entry_count: int


class TrialBalanceEntry(BaseModel):
    account: str
    total_debit: float
    total_credit: float
    balance: float


class TrialBalanceResponse(BaseModel):
    entries: list[TrialBalanceEntry]
    total_debit: float
    total_credits: float = 0
    total_credit: float
    total_debits: float = 0
    is_balanced: bool
