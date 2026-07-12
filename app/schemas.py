from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr

class PostResponse(BaseModel):
    id: str
    caption: str
    image_url: str

class UpdateProfile(BaseModel):
    username: str | None = None
    profile_picture: str | None = None

    