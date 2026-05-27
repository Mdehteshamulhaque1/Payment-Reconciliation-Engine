from sqlalchemy import Column, Integer, String, JSON
from app.db.base import Base

class Rule(Base):
    __tablename__ = "rules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    definition = Column(JSON, nullable=True)
