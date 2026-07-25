from pydantic import BaseModel
from datetime import datetime


class DashboardKPIs(BaseModel):
    total_transactions: int
    total_amount: float
    success_rate: float
    total_settlements: int
    pending_settlements: int
    reconciliation_accuracy: float
    fraud_cases: int
    active_gateways: int


class GatewayComparison(BaseModel):
    gateway_name: str
    total_transactions: int
    success_rate: float
    avg_latency_ms: float
    total_amount: float


class RevenueData(BaseModel):
    period: str
    revenue: float
    transactions: int


class TrendData(BaseModel):
    period: str
    value: float
    label: str


class TopFailure(BaseModel):
    reason: str
    count: int
    percentage: float
