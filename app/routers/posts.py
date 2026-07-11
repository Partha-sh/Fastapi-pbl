from fastapi import APIRouter, UploadFile, File, Form, Depends
from fastapi import HTTPException
from app.dependencies import get_current_user
from app.models import User, Post
from app.services.imagekit_service import upload_image
from typing import List
router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

@router.post("/")
async def create_post(
    caption: str = Form(...),
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):

    image_bytes = await image.read()

    image_url = upload_image(
        image_bytes,
        image.filename
    )

    post = Post(
        user_id=current_user.id,
        caption=caption,
        image_url=image_url
    )

    await post.insert()



    return post
@router.get("/")
async def get_posts():

    posts = await (
        Post.find_all()
        .sort("-created_at")
        .to_list()
    )

    return posts

@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user)
):

    post = await Post.get(post_id)

    if not post:
        raise HTTPException(404, "Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(403, "Not allowed")

    await post.delete()

    return {
        "message": "Post deleted"
    }