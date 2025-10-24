from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Permissions(BaseModel):
    manage_courses: bool = False
    manage_users: bool = False
    manage_content: bool = False
    manage_stats: bool = False
    manage_campus: bool = False
    view_analytics: bool = False
    can_delete: bool = False


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"  # student, admin, super_admin
    permissions: Optional[Permissions] = None


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    permissions: Optional[Permissions] = None


class User(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class UserInDB(User):
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class CourseBase(BaseModel):
    title: str
    description: str
    duration: str
    level: str
    price: float
    image: str


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    level: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None


class Course(CourseBase):
    id: str = Field(alias="_id")
    enrolled_count: int = 0
    rating: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class EnrollmentCreate(BaseModel):
    course_id: str


class EnrollmentUpdate(BaseModel):
    progress: int


class Enrollment(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    course_id: str
    progress: int = 0
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class EnrollmentWithCourse(BaseModel):
    enrollment: Enrollment
    course: Course


class StatsBase(BaseModel):
    webinar_listeners: int
    virtual_classes: int
    key_opinion_leaders: int
    subscribers: int


class StatsUpdate(StatsBase):
    pass


class Stats(StatsBase):
    id: str = Field(alias="_id")
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class CampusBase(BaseModel):
    name: str
    location: str
    image: str
    description: str


class CampusCreate(CampusBase):
    pass


class CampusUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None


class Campus(CampusBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class DashboardStats(BaseModel):
    total_users: int
    total_courses: int
    total_enrollments: int
    total_students: int
    total_admins: int


class ContactMessage(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    subject: str
    message: str
    status: str = "new"  # new, read, replied
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
