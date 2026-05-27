from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base

class ExceptionRecord(Base):
    __tablename__ = "exceptions"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String(2000))
    occurred_at = Column(DateTime)
