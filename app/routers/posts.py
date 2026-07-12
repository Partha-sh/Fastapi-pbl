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
from fastapi import Query

@router.get("/")
async def get_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):

    skip = (page - 1) * limit

    posts = (
        await Post.find_all()
        .sort("-created_at")
        .skip(skip)
        .limit(limit)
        .to_list()
    )

    feed = []

    for post in posts:

        user = await User.get(post.user_id)

        feed.append({
            "id": str(post.id),
            "caption": post.caption,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "username": user.username if user else "Unknown",
            "profile_picture": user.profile_picture if user else None
        })

    return feed

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
    "success": True,
    "message": "Post deleted successfully"
}

@router.get("/{post_id}")
async def get_post(post_id: str):

    post = await Post.get(post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    user = await User.get(post.user_id)

    return {
        "id": str(post.id),
        "caption": post.caption,
        "image_url": post.image_url,
        "created_at": post.created_at,
        "username": user.username if user else "Unknown",
        "profile_picture": user.profile_picture if user else None
    }