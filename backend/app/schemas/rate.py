from datetime import date
from typing import Optional
from pydantic import BaseModel

class RateAdjustmentBase(BaseModel):
    room_type_id: int
    adjustment_amount: float
    effective_date: date
    reason: Optional[str] = None

class RateAdjustmentCreate(RateAdjustmentBase):
    pass

class RateAdjustment(RateAdjustmentBase):
    id: int

    class Config:
        from_attributes = True
