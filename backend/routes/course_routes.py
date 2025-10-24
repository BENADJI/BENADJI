from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import Course, CourseCreate, CourseUpdate
from database import courses_collection
from dependencies import get_current_admin_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=List[Course])
async def get_courses(
    level: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    query = {}
    
    if level:
        query["level"] = level
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    courses = await courses_collection.find(query).to_list(1000)
    
    for course in courses:
        course["_id"] = str(course["_id"])
    
    return [Course(**course) for course in courses]


@router.get("/{course_id}", response_model=Course)
async def get_course(course_id: str):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )
    
    course = await courses_collection.find_one({"_id": ObjectId(course_id)})
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    course["_id"] = str(course["_id"])
    return Course(**course)


@router.post("", response_model=Course)
async def create_course(
    course_data: CourseCreate,
    admin_user = Depends(get_current_admin_user)
):
    new_course = {
        **course_data.dict(),
        "enrolled_count": 0,
        "rating": 0.0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await courses_collection.insert_one(new_course)
    new_course["_id"] = str(result.inserted_id)
    
    return Course(**new_course)


@router.put("/{course_id}", response_model=Course)
async def update_course(
    course_id: str,
    course_data: CourseUpdate,
    admin_user = Depends(get_current_admin_user)
):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )
    
    update_data = {k: v for k, v in course_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await courses_collection.find_one_and_update(
        {"_id": ObjectId(course_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    result["_id"] = str(result["_id"])
    return Course(**result)


@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    admin_user = Depends(get_current_admin_user)
):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )
    
    result = await courses_collection.delete_one({"_id": ObjectId(course_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    return {"message": "Course deleted successfully"}
