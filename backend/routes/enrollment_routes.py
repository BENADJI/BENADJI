from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models import Enrollment, EnrollmentCreate, EnrollmentUpdate, EnrollmentWithCourse, Course, User
from database import enrollments_collection, courses_collection
from dependencies import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])


@router.post("", response_model=dict)
async def enroll_in_course(
    enrollment_data: EnrollmentCreate,
    current_user: User = Depends(get_current_user)
):
    # Verify course exists
    if not ObjectId.is_valid(enrollment_data.course_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )
    
    course = await courses_collection.find_one({"_id": ObjectId(enrollment_data.course_id)})
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check if already enrolled
    existing_enrollment = await enrollments_collection.find_one({
        "user_id": current_user.id,
        "course_id": enrollment_data.course_id
    })
    
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this course"
        )
    
    # Create enrollment
    new_enrollment = {
        "user_id": current_user.id,
        "course_id": enrollment_data.course_id,
        "progress": 0,
        "enrolled_at": datetime.utcnow(),
        "completed_at": None
    }
    
    result = await enrollments_collection.insert_one(new_enrollment)
    new_enrollment["_id"] = str(result.inserted_id)
    
    # Increment enrolled_count
    await courses_collection.update_one(
        {"_id": ObjectId(enrollment_data.course_id)},
        {"$inc": {"enrolled_count": 1}}
    )
    
    return {
        "message": "Successfully enrolled",
        "enrollment": Enrollment(**new_enrollment)
    }


@router.get("/my-courses", response_model=List[dict])
async def get_my_courses(current_user: User = Depends(get_current_user)):
    enrollments = await enrollments_collection.find({"user_id": current_user.id}).to_list(1000)
    
    result = []
    for enrollment in enrollments:
        course = await courses_collection.find_one({"_id": ObjectId(enrollment["course_id"])})
        if course:
            course["_id"] = str(course["_id"])
            enrollment["_id"] = str(enrollment["_id"])
            result.append({
                "enrollment": Enrollment(**enrollment),
                "course": Course(**course)
            })
    
    return result


@router.put("/{enrollment_id}/progress", response_model=Enrollment)
async def update_progress(
    enrollment_id: str,
    progress_data: EnrollmentUpdate,
    current_user: User = Depends(get_current_user)
):
    if not ObjectId.is_valid(enrollment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid enrollment ID"
        )
    
    # Verify enrollment belongs to user
    enrollment = await enrollments_collection.find_one({
        "_id": ObjectId(enrollment_id),
        "user_id": current_user.id
    })
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )
    
    # Update progress
    update_data = {"progress": progress_data.progress}
    
    # Mark as completed if progress is 100
    if progress_data.progress >= 100:
        update_data["completed_at"] = datetime.utcnow()
    
    result = await enrollments_collection.find_one_and_update(
        {"_id": ObjectId(enrollment_id)},
        {"$set": update_data},
        return_document=True
    )
    
    result["_id"] = str(result["_id"])
    return Enrollment(**result)
