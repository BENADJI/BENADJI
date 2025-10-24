from fastapi import APIRouter, HTTPException, status, Depends
from models import UserCreate, UserLogin, Token, User
from auth import get_password_hash, verify_password, create_access_token
from database import users_collection
from dependencies import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "role": "student",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(new_user)
    new_user["_id"] = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    return {
        "token": access_token,
        "user": {
            "id": new_user["_id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"]
        }
    }


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    # Find user
    user = await users_collection.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": credentials.email})
    
    return {
        "token": access_token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }


@router.get("/me", response_model=dict)
async def get_me(current_user: User = Depends(get_current_user)):
    return {"user": current_user.dict()}
