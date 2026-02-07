from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, Float
from app.db.base import Base
# Avoid circular import by using string reference for relationships
# from app.models.rate import RateAdjustment 

class Hotel(Base):
    __tablename__ = "hotels"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    location: Mapped[str] = mapped_column(String)
    
    room_types: Mapped[List["RoomType"]] = relationship(back_populates="hotel", cascade="all, delete-orphan")

class RoomType(Base):
    __tablename__ = "room_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    hotel_id: Mapped[int] = mapped_column(ForeignKey("hotels.id"))
    name: Mapped[str] = mapped_column(String) # e.g., "Deluxe", "Standard"
    base_price: Mapped[float] = mapped_column(Float)
    
    hotel: Mapped["Hotel"] = relationship(back_populates="room_types")
    rate_adjustments: Mapped[List["RateAdjustment"]] = relationship(back_populates="room_type", cascade="all, delete-orphan")
