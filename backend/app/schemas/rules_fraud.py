import json
from datetime import datetime

from pydantic import BaseModel, ConfigDict, model_validator


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
    ml_risk_score: float | None = None
    rule_risk_score: float | None = None
    model_contributions: str | None = None
    shap_explanation: str | None = None
    evidence_json: str | None = None
    reason: str = ""
    description: str = ""
    severity: str = "medium"
    status: str
    assigned_to: int | None = None
    escalated: bool = False
    escalated_to: int | None = None
    tags: str | None = None
    resolution: str | None = None
    review_notes: str | None = None
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


class FraudCaseDetailResponse(FraudCaseOut):
    features: dict | None = None
    shap_top_factors: list[dict] | None = None
    model_scores: dict | None = None


class FraudDashboard(BaseModel):
    total_cases: int
    open_cases: int = 0
    investigating: int = 0
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    resolved: int = 0
    confirmed_fraud: int = 0
    false_positives: int = 0
    avg_risk_score: float
    cases_last_24h: int = 0


class FraudScanResponse(BaseModel):
    is_suspicious: bool
    risk_score: float
    rule_risk_score: float = 0.0
    ml_risk_score: float = 0.0
    fraud_type: str | None
    factors: list[str]
    case_id: int | None = None
    alert_id: int | None = None
    ml_explanation: dict | None = None
    travel_check: dict | None = None
    velocity_check: dict | None = None
    behavioral_check: dict | None = None
    graph_check: dict | None = None


class FraudAlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    transaction_id: int | None
    case_id: int | None
    alert_type: str
    severity: str
    status: str
    title: str
    description: str | None
    metadata_json: str | None
    is_read: bool = False
    assigned_to: int | None
    created_at: datetime
    resolved_at: datetime | None


class FraudAlertListResponse(BaseModel):
    items: list[FraudAlertOut]
    total: int


class MLDashboardOut(BaseModel):
    avg_ml_risk_score: float
    avg_rule_risk_score: float
    ml_case_count: int
    model_usage: dict
    feature_importance: dict
    fraud_rings: list[dict]
    ml_enabled: bool


class DeviceFingerprintOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    fingerprint_hash: str
    user_agent: str | None
    screen_resolution: str | None
    platform: str | None
    language: str | None
    is_suspicious: bool
    risk_score: float
    first_seen_at: datetime
    last_seen_at: datetime


class DeviceIdentifyResponse(BaseModel):
    fingerprint_hash: str
    is_new_device: bool
    device_id: int
    is_suspicious: bool
    risk_score: float
    suspicious_reasons: list[str]


class BehavioralProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    entity_type: str
    entity_id: int
    avg_amount: float
    avg_amount_30d: float
    txn_count_total: int
    txn_count_24h: int
    failure_rate: float
    avg_txn_interval_minutes: float
    profile_risk_score: float
    profile_risk_level: str
    last_updated: datetime


class AssignCaseRequest(BaseModel):
    assigned_to: int


class EscalateCaseRequest(BaseModel):
    escalated_to: int


class ResolveCaseRequest(BaseModel):
    status: str = "resolved"
    notes: str | None = None
    resolution: str | None = None


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
