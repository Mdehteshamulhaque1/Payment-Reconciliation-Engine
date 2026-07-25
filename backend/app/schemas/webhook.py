from pydantic import BaseModel, ConfigDict
from datetime import datetime


class WebhookEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    source: str
    event_type: str
    external_id: str | None
    status: str
    retry_count: int
    error_message: str | None
    created_at: datetime
    processed_at: datetime | None


class WebhookLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    webhook_event_id: int
    attempt: int
    status_code: int | None
    response_body: str | None
    error: str | None
    duration_ms: float | None
    created_at: datetime


class WebhookListResponse(BaseModel):
    items: list[WebhookEventOut]
    total: int


class WebhookStatsResponse(BaseModel):
    total: int
    processed: int
    failed: int
    success_rate: float
