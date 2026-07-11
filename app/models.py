from beanie import Document
from pydantic import EmailStr
from datetime import datetime
from typing import Optional
from bson import ObjectId
from beanie import PydanticObjectId

class User(Document):
    username: str
    email: EmailStr
    hashed_password: str
    profile_picture: Optional[str] = None
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"





class Post(Document):
    user_id: PydanticObjectId

    caption: str

    image_url: str

    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "posts"