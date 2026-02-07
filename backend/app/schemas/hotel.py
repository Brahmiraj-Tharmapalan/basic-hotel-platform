from typing import List, Optional
from pydantic import BaseModel, Field

# RoomType Schemas
class RoomTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float = Field(..., alias="basePrice")
    capacity: int = 2
    amenities: Optional[str] = None

class RoomTypeCreate(RoomTypeBase):
    class Config:
        populate_by_name = True

class RoomTypeUpdate(RoomTypeBase):
    name: Optional[str] = None
    base_price: Optional[float] = Field(None, alias="basePrice")
    capacity: Optional[int] = None
    
    class Config:
        populate_by_name = True

class RoomType(RoomTypeBase):
    id: int
    hotel_id: int = Field(..., alias="hotelId")

    class Config:
        from_attributes = True
        populate_by_name = True

# Hotel Schemas
class HotelBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None
    rating: Optional[float] = 0.0
    image_url: Optional[str] = Field(None, alias="imageUrl")

class HotelCreate(HotelBase):
    class Config:
        populate_by_name = True

class HotelUpdate(HotelBase):
    name: Optional[str] = None
    location: Optional[str] = None
    
    class Config:
        populate_by_name = True

class Hotel(HotelBase):
    id: int
    # Removed room_types to avoid lazy loading issues with async SQLAlchemy
    # room_types: List[RoomType] = []

    class Config:
        from_attributes = True
        populate_by_name = True

