# here we have to write the fields thats are essential to write a post

from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    content: str