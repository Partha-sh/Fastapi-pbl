from fastapi import APIRouter, Depends, HTTPException
from app.schemas import UpdateProfile
from app.dependencies import get_current_user
from app.models import User, Post

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me")
async def get_my_profile(
    current_user: User = Depends(get_current_user)
):

    total_posts = await Post.find(
        Post.user_id == current_user.id
    ).count()

    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "profile_picture": current_user.profile_picture,
        "total_posts": total_posts
    }

@router.get("/{username}")
async def get_user_profile(username: str):

    user = await User.find_one(
        User.username == username
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    total_posts = await Post.find(
        Post.user_id == user.id
    ).count()

    return {
        "username": user.username,
        "profile_picture": user.profile_picture,
        "total_posts": total_posts
    }

@router.put("/me")
async def update_profile(
    data: UpdateProfile,
    current_user: User = Depends(get_current_user)
):

    if data.username is not None:
        current_user.username = data.username

    if data.profile_picture is not None:
        current_user.profile_picture = data.profile_picture

    await current_user.save()

    return {
        "message": "Profile updated successfully",
        "username": current_user.username,
        "profile_picture": current_user.profile_picture
    }