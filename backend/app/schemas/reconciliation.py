from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReconciliationOut(BaseModel):
    id: int
    status: str
    score: Optional[float]
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
