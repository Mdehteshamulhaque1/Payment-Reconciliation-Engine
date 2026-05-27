from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Gateway(Base):
    __tablename__ = "gateways"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    config = Column(String(2000), nullable=True)
