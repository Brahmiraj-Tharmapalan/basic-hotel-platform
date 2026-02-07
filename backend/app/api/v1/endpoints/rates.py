from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.api.deps import CurrentUser
from app.schemas import rate as schemas
from app.crud import crud_rate

router = APIRouter()

@router.post("/", response_model=schemas.RateAdjustment)
async def create_rate_adjustment(
    rate: schemas.RateAdjustmentCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(deps.get_db),
):
    """
    Create a new rate adjustment.
    """
    return await crud_rate.create_rate_adjustment(db=db, rate=rate)

@router.get("/", response_model=List[schemas.RateAdjustment])
async def read_rate_adjustments(
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
):
    """
    Retrieve rate adjustments.
    """
    return await crud_rate.get_rate_adjustments(db, skip=skip, limit=limit)
