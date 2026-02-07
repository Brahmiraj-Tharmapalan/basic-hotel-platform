from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, Float, Text
from app.db.base import Base

class Hotel(Base):
    __tablename__ = "hotels"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    location: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    room_types: Mapped[List["RoomType"]] = relationship(back_populates="hotel", cascade="all, delete-orphan")

class RoomType(Base):
    __tablename__ = "room_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    hotel_id: Mapped[int] = mapped_column(ForeignKey("hotels.id"))
    name: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    base_price: Mapped[float] = mapped_column(Float)
    capacity: Mapped[int] = mapped_column(Integer, default=2)
    amenities: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # Storing as comma-separated string for simplicity
    
    hotel: Mapped["Hotel"] = relationship(back_populates="room_types")
    
    rate_adjustments: Mapped[List["RateAdjustment"]] = relationship(back_populates="room_type", cascade="all, delete-orphan")

    @property
    def effective_price(self) -> float:
        from datetime import date
        today = date.today()
        
        try:
            # Check if rate_adjustments is loaded to avoid LazyLoad error in async
            adjustments = self.rate_adjustments
        except Exception:
            return self.base_price

        # Sort adjustments by effective_date descending
        # We process in Python because the list is expected to be small per room type
        relevant_adjustments = [
            adj for adj in adjustments 
            if adj.effective_date <= today
        ]
        
        if not relevant_adjustments:
            return self.base_price
            
        # Get the latest one (closest to today but in the past/today)
        latest_adjustment = max(relevant_adjustments, key=lambda x: x.effective_date)
        
        return self.base_price + latest_adjustment.adjustment_amount
