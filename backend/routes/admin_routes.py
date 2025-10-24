from fastapi import APIRouter, Depends
from typing import List
from ..models import User, DashboardStats
from ..database import users_collection, courses_collection, enrollments_collection
from ..dependencies import get_current_admin_user

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
    total_admins = await users_collection.count_documents({"role": "admin"})
    
    return DashboardStats(
        total_users=total_users,
        total_courses=total_courses,
        total_enrollments=total_enrollments,
        total_students=total_students,
        total_admins=total_admins
    )
