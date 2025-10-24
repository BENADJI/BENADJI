from fastapi import Depends, HTTPException, status
from auth import get_current_user_email
from database import users_collection
from models import User


async def get_current_user(email: str = Depends(get_current_user_email)) -> User:
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    user["_id"] = str(user["_id"])
    return User(**user)


async def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
