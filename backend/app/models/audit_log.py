from sqlalchemy import Column, Integer, String, DateTime, JSON
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(200))
    actor = Column(String(200))
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime)
