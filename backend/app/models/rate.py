from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, Float, Date, String, UniqueConstraint
from app.db.base import Base

class RateAdjustment(Base):
    __tablename__ = "rate_adjustments"
    __table_args__ = (UniqueConstraint('room_type_id', 'effective_date', name='uq_rate_adjustment_room_date'),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    room_type_id: Mapped[int] = mapped_column(ForeignKey("room_types.id"))
    adjustment_amount: Mapped[float] = mapped_column(Float) # Can be negative
    effective_date: Mapped[date] = mapped_column(Date, index=True)
    reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    room_type: Mapped["RoomType"] = relationship(back_populates="rate_adjustments")
