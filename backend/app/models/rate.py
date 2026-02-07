from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, Float, Date, String
from app.db.base import Base

class RateAdjustment(Base):
    __tablename__ = "rate_adjustments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    room_type_id: Mapped[int] = mapped_column(ForeignKey("room_types.id"))
    adjustment_amount: Mapped[float] = mapped_column(Float) # Can be negative
    effective_date: Mapped[date] = mapped_column(Date, index=True)
    reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    room_type: Mapped["RoomType"] = relationship(back_populates="rate_adjustments")
