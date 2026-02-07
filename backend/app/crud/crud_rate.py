from typing import List, Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.rate import RateAdjustment
from app.schemas import rate as schemas

async def create_rate_adjustment(db: AsyncSession, rate: schemas.RateAdjustmentCreate) -> RateAdjustment:
    db_rate = RateAdjustment(**rate.model_dump())
    db.add(db_rate)
    await db.commit()
    await db.refresh(db_rate)
    return db_rate

async def get_rate_adjustments(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[RateAdjustment]:
    result = await db.execute(select(RateAdjustment).order_by(desc(RateAdjustment.effective_date)).offset(skip).limit(limit))
    return result.scalars().all()
