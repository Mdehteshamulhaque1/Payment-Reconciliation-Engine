from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PaymentLocationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    transaction_id: int
    sender_id: int | None
    receiver_id: int | None
    amount: float
    latitude: float
    longitude: float
    accuracy: float | None
    city: str | None
    state: str | None
    country: str | None
    full_address: str | None
    timezone: str | None
    ip_address: str | None
    device_info: str | None
    payment_timestamp: datetime | None
    location_capture_timestamp: datetime | None
    google_maps_url: str | None
    created_at: datetime


class PaymentLocationResponse(BaseModel):
    transaction_id: str
    amount: float
    sender: str | None
    receiver: str | None
    payment_time: datetime | None
    location: PaymentLocationOut | None
