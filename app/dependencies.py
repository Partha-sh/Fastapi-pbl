from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from bson import ObjectId
import os

from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET_KEY"),
            algorithms=[os.getenv("ALGORITHM")]
        )

        user_id = payload.get("id")

        if user_id is None:
            raise HTTPException(401, "Invalid Token")

    except JWTError:
        raise HTTPException(401, "Invalid Token")

    user = await User.get(ObjectId(user_id))

    if not user:
        raise HTTPException(401, "User Not Found")

    return user