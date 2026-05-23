from datetime import datetime

from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    status: str = Field(..., examples=["healthy"])
    service: str
    version: str
    environment: str
    database: str
    timestamp: datetime
