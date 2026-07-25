from pydantic import BaseModel, ConfigDict, model_validator
from datetime import datetime


class ReconciliationResultOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    transaction_id: int
    transaction_ref: str = ""
    batch_id: str | None
    internal_status: str | None
    gateway_status: str | None
    settlement_status: str | None
    bank_status: str | None
    match_type: str | None
    discrepancy_type: str
    result_type: str = ""
    type: str = ""
    status: str = "pending"
    confidence: float | None = None
    match_score: float | None
    is_resolved: bool
    created_at: datetime

    @model_validator(mode='after')
    def compute_fields(self):
        self.result_type = self.discrepancy_type
        self.type = self.discrepancy_type
        if self.is_resolved:
            self.status = "resolved"
        if self.confidence is None and self.match_score is not None:
            self.confidence = self.match_score
        elif self.confidence is None:
            self.confidence = 0.0
        return self


class ReconciliationListResponse(BaseModel):
    items: list[ReconciliationResultOut]
    total: int


class ReconciliationSummary(BaseModel):
    total: int = 0
    total_checked: int = 0
    matched: int = 0
    mismatches: int = 0
    missing: int = 0
    missing_internal: int = 0
    missing_gateway: int = 0
    duplicates: int = 0
    accuracy_pct: float = 0.0
    accuracy: float = 0.0


class ReconciliationResolveRequest(BaseModel):
    resolved_by: str
    notes: str | None = None
