from fastapi import APIRouter
from app.api.v1.endpoints import login, users, hotels

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(hotels.router, prefix="/hotels", tags=["hotels"])
