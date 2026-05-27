from pydantic import BaseModel
from typing import Any

class ReportOut(BaseModel):
    id: int
    name: str
    metadata: Any

    class Config:
        orm_mode = True
