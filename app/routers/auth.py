from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from app.dependencies import get_current_user
from app.models import User
from app.models import User
from app.schemas import UserRegister, UserLogin
from app.auth import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register(user: UserRegister):

    if await User.find_one(User.email == user.email):
        raise HTTPException(400, "Email already exists")

    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    await db_user.insert()

    return {"message": "User Registered"}


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    db_user = await User.find_one(User.email == form_data.username)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    if not verify_password(
        form_data.password,
        db_user.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    token = create_access_token(
        {
            "id": str(db_user.id),
            "email": db_user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@router.get("/me")
async def me(
    current_user: User = Depends(get_current_user)
):
    return current_user