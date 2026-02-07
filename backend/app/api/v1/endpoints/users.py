from typing import Any

from fastapi import APIRouter
from app.api.deps import CurrentUser
from app.schemas import user as user_schema

router = APIRouter()

@router.get("/me", response_model=user_schema.User)
def read_user_me(
    current_user: CurrentUser,
) -> Any:
    """
    Get current user.
    """
    return current_user
