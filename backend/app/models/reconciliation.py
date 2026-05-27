from sqlalchemy import Column, Integer, String, DateTime, Float
from app.db.base import Base

class Reconciliation(Base):
    __tablename__ = "reconciliations"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String(50), index=True)
    score = Column(Float, nullable=True)
    created_at = Column(DateTime)
