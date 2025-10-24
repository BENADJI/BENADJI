from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import User, DashboardStats, UserUpdate, Permissions
from database import users_collection, courses_collection, enrollments_collection
from dependencies import get_current_admin_user, get_current_super_admin
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", response_model=List[User])
async def get_all_users(admin_user = Depends(get_current_admin_user)):
    users = await users_collection.find().to_list(1000)
    
    for user in users:
        user["_id"] = str(user["_id"])
    
    return [User(**user) for user in users]


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(admin_user = Depends(get_current_admin_user)):
    total_users = await users_collection.count_documents({})
    total_courses = await courses_collection.count_documents({})
    total_enrollments = await enrollments_collection.count_documents({})
    total_students = await users_collection.count_documents({"role": "student"})
    total_admins = await users_collection.count_documents({"role": {"$in": ["admin", "super_admin"]}})
    
    return DashboardStats(
        total_users=total_users,
        total_courses=total_courses,
        total_enrollments=total_enrollments,
        total_students=total_students,
        total_admins=total_admins
    )


@router.put("/users/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    super_admin = Depends(get_current_super_admin)
):
    """Only super admin can update user roles and permissions"""
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    update_data = {k: v for k, v in user_data.dict(exclude_unset=True).items() if v is not None}
    
    if "permissions" in update_data and update_data["permissions"]:
        update_data["permissions"] = update_data["permissions"].dict()
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await users_collection.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    result["_id"] = str(result["_id"])
    return User(**result)


@router.post("/users/{user_id}/make-admin")
async def make_user_admin(
    user_id: str,
    permissions: Permissions,
    super_admin = Depends(get_current_super_admin)
):
    """Convert a user to admin with specific permissions"""
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    result = await users_collection.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "role": "admin",
                "permissions": permissions.dict(),
                "updated_at": datetime.utcnow()
            }
        },
        return_document=True
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User promoted to admin", "user_id": user_id}


@router.post("/users/{user_id}/revoke-admin")
async def revoke_admin(
    user_id: str,
    super_admin = Depends(get_current_super_admin)
):
    """Revoke admin privileges from a user"""
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Check if trying to revoke own admin
    if user_id == super_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot revoke your own admin privileges"
        )
    
    result = await users_collection.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "role": "student",
                "permissions": None,
                "updated_at": datetime.utcnow()
            }
        },
        return_document=True
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "Admin privileges revoked", "user_id": user_id}


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    super_admin = Depends(get_current_super_admin)
):
    """Delete a user (super admin only)"""
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Cannot delete yourself
    if user_id == super_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    result = await users_collection.delete_one({"_id": ObjectId(user_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Also delete user's enrollments
    await enrollments_collection.delete_many({"user_id": user_id})
    
    return {"message": "User deleted successfully"}
