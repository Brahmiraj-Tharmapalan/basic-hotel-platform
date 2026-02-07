from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from app.api.deps import SessionDep
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.token import Token

router = APIRouter()

@router.post("/login/access-token")
async def login_access_token(
    response: Response, session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    try:
        # 1. Get user by email
        print(f"DEBUG: Attempting login for {form_data.username}")
        result = await session.execute(select(User).where(User.email == form_data.username))
        user = result.scalar_one_or_none()
        print(f"DEBUG: User found: {user}")

        # 2. Verify password
        if not user or not security.verify_password(form_data.password, user.hashed_password):
            print("DEBUG: Password verification failed")
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        if not user.is_active:
            print("DEBUG: User inactive")
            raise HTTPException(status_code=400, detail="Inactive user")

        # 3. Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
        
        # Set HttpOnly cookie
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            samesite="lax",
            secure=False, # Set to True in production (HTTPS)
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
        )
    except Exception as e:
        import traceback
        with open("d:\\Git\\basic-hotel-platform\\backend\\error.log", "a") as f:
            f.write(f"ERROR: {e}\n")
            traceback.print_exc(file=f)
        print(f"ERROR: Login endpoint exception: {e}")
        traceback.print_exc()
        raise e
