from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.hotel import Hotel, RoomType
from app.schemas.hotel import HotelCreate, HotelUpdate, RoomTypeCreate, RoomTypeUpdate

async def get_hotel(db: AsyncSession, hotel_id: int) -> Optional[Hotel]:
    result = await db.execute(select(Hotel).filter(Hotel.id == hotel_id))
    return result.scalars().first()

async def get_hotels(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Hotel]:
    result = await db.execute(select(Hotel).offset(skip).limit(limit))
    return result.scalars().all()

async def create_hotel(db: AsyncSession, hotel: HotelCreate) -> Hotel:
    db_hotel = Hotel(
        name=hotel.name,
        location=hotel.location,
        description=hotel.description,
        rating=hotel.rating,
        image_url=hotel.image_url
    )
    db.add(db_hotel)
    await db.commit()
    await db.refresh(db_hotel)
    return db_hotel

async def update_hotel(db: AsyncSession, hotel_id: int, hotel: HotelUpdate) -> Optional[Hotel]:
    db_hotel = await get_hotel(db, hotel_id)
    if not db_hotel:
        return None
    
    update_data = hotel.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_hotel, key, value)

    db.add(db_hotel)
    await db.commit()
    await db.refresh(db_hotel)
    return db_hotel

async def delete_hotel(db: AsyncSession, hotel_id: int) -> bool:
    db_hotel = await get_hotel(db, hotel_id)
    if not db_hotel:
        return False
    
    await db.delete(db_hotel)
    await db.commit()
    return True

async def create_room_type(db: AsyncSession, room_type: RoomTypeCreate, hotel_id: int) -> RoomType:
    db_room_type = RoomType(
        **room_type.model_dump(),
        hotel_id=hotel_id
    )
    db.add(db_room_type)
    await db.commit()
    
    # Re-fetch with eager loading to allow serialization of properties
    result = await db.execute(
        select(RoomType)
        .where(RoomType.id == db_room_type.id)
        .options(selectinload(RoomType.rate_adjustments))
    )
    return result.scalars().one()

async def get_room_types(db: AsyncSession, hotel_id: int) -> List[RoomType]:
    result = await db.execute(
        select(RoomType)
        .filter(RoomType.hotel_id == hotel_id)
        .options(selectinload(RoomType.rate_adjustments))
    )
    return result.scalars().all()

async def get_room_type(db: AsyncSession, room_id: int) -> Optional[RoomType]:
    result = await db.execute(
        select(RoomType)
        .where(RoomType.id == room_id)
        .options(selectinload(RoomType.rate_adjustments))
    )
    return result.scalars().first()

async def update_room_type(db: AsyncSession, room_id: int, room_type: RoomTypeUpdate) -> Optional[RoomType]:
    db_room_type = await get_room_type(db, room_id)
    if not db_room_type:
        return None
    
    update_data = room_type.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_room_type, key, value)
    
    db.add(db_room_type)
    await db.commit()
    await db.refresh(db_room_type)
    return db_room_type

async def delete_room_type(db: AsyncSession, room_id: int) -> bool:
    db_room_type = await get_room_type(db, room_id)
    if not db_room_type:
        return False
    
    await db.delete(db_room_type)
    await db.commit()
    return True
