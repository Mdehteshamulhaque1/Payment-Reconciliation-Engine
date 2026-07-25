from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    report_type: str
    format: str
    status: str
    file_path: str | None
    created_at: datetime


class ReportCreateRequest(BaseModel):
    name: str
    report_type: str
    format: str = "csv"
    parameters_json: str | None = None


class ReportListResponse(BaseModel):
    items: list[ReportOut]
    total: int


class SearchResult(BaseModel):
    id: int
    type: str
    title: str
    subtitle: str
    url: str


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
    total: int


class AdminUserOut(BaseModel):
    id: int
    email: str
    full_name: str | None
    is_active: bool
    is_superuser: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int | None
    action: str
    resource: str
    resource_id: str | None
    ip_address: str | None
    created_at: datetime


class AuditLogListResponse(BaseModel):
    items: list[AuditLogOut]
    total: int
