from fastapi import Depends, HTTPException, status
from auth import get_current_user_email
from database import users_collection
from models import User, Permissions


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
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


async def get_current_super_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    return current_user


async def check_permission(permission: str):
    async def permission_checker(current_user: User = Depends(get_current_user)):
        # Super admin has all permissions
        if current_user.role == "super_admin":
            return current_user
        
        # Regular admin with permissions
        if current_user.role == "admin" and current_user.permissions:
            if getattr(current_user.permissions, permission, False):
                return current_user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permission '{permission}' required"
        )
    return permission_checker
