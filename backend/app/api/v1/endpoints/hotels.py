from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.api.deps import CurrentUser
from app.schemas import hotel as schemas
from app.crud import crud_hotel

router = APIRouter()

@router.get("/", response_model=List[schemas.Hotel], response_model_by_alias=True)
async def read_hotels(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Public endpoint - no authentication required"""
    hotels = await crud_hotel.get_hotels(db, skip=skip, limit=limit)
    return hotels

@router.post("/", response_model=schemas.Hotel)
async def create_hotel(
    hotel: schemas.HotelCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(deps.get_db),
):
    """Protected endpoint - requires authentication"""
    return await crud_hotel.create_hotel(db=db, hotel=hotel)

@router.get("/{hotel_id}", response_model=schemas.Hotel)
async def read_hotel(
    hotel_id: int,
    db: AsyncSession = Depends(deps.get_db),
):
    """Public endpoint - no authentication required"""
    db_hotel = await crud_hotel.get_hotel(db, hotel_id=hotel_id)
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return db_hotel

@router.put("/{hotel_id}", response_model=schemas.Hotel)
async def update_hotel(
    hotel_id: int,
    hotel: schemas.HotelUpdate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(deps.get_db),
):
    """Protected endpoint - requires authentication"""
    db_hotel = await crud_hotel.update_hotel(db, hotel_id=hotel_id, hotel=hotel)
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return db_hotel

@router.delete("/{hotel_id}", response_model=schemas.Hotel)
async def delete_hotel(
    hotel_id: int,
    current_user: CurrentUser,
    db: AsyncSession = Depends(deps.get_db),
):
    """Protected endpoint - requires authentication"""
    db_hotel = await crud_hotel.get_hotel(db, hotel_id=hotel_id)
    if not db_hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    await crud_hotel.delete_hotel(db, hotel_id=hotel_id)
    return db_hotel

@router.post("/{hotel_id}/rooms", response_model=schemas.RoomType)
async def create_room_type(
    hotel_id: int,
    room_type: schemas.RoomTypeCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(deps.get_db),
):
    """Protected endpoint - requires authentication"""
    db_hotel = await crud_hotel.get_hotel(db, hotel_id=hotel_id)
    if not db_hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return await crud_hotel.create_room_type(db=db, room_type=room_type, hotel_id=hotel_id)
