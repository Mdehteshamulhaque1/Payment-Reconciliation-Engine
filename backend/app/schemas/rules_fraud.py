import json
from pydantic import BaseModel, ConfigDict, model_validator
from datetime import datetime


class RuleCreate(BaseModel):
    name: str
    description: str | None = None
    condition_json: str
    action: str
    priority: int = 0
    is_active: bool = True


class RuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str | None
    condition_json: str
    action: str
    priority: int
    is_active: bool
    created_at: datetime


class RuleTestRequest(BaseModel):
    condition_json: str
    transaction_data: dict


class FraudCaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    transaction_id: int
    fraud_type: str
    risk_score: float
    reason: str = ""
    description: str = ""
    severity: str = "medium"
    status: str
    created_at: datetime

    @model_validator(mode='after')
    def compute_fields(self):
        if self.risk_score >= 0.8:
            self.severity = "critical"
        elif self.risk_score >= 0.6:
            self.severity = "high"
        elif self.risk_score >= 0.4:
            self.severity = "medium"
        else:
            self.severity = "low"
        if not self.reason:
            self.reason = self.fraud_type.replace("_", " ").title()
        if not self.description:
            self.description = self.reason
        return self


class FraudCaseListResponse(BaseModel):
    items: list[FraudCaseOut]
    total: int


class FraudDashboard(BaseModel):
    total_cases: int
    open_cases: int = 0
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    resolved: int = 0
    confirmed_fraud: int = 0
    false_positives: int = 0
    avg_risk_score: float


class FraudScanResponse(BaseModel):
    is_suspicious: bool
    risk_score: float
    fraud_type: str | None
    factors: list[str]


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    channel: str
    subject: str
    body: str
    status: str
    is_read: bool = False
    created_at: datetime
    read_at: datetime | None

    @model_validator(mode='after')
    def compute_is_read(self):
        s = self.status
        self.is_read = (s == "read") if isinstance(s, str) else (s.value == "read")
        return self


class NotificationListResponse(BaseModel):
    items: list[NotificationOut]
    total: int


class MessageResponse(BaseModel):
    message: str
