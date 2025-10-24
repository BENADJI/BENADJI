from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models import ContactMessage, ContactMessageCreate
from database import db
from dependencies import get_current_admin_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/contact", tags=["Contact"])
contact_collection = db.contact_messages


@router.post("", response_model=dict)
async def send_contact_message(message_data: ContactMessageCreate):
    """Public endpoint for sending contact messages"""
    new_message = {
        **message_data.dict(),
        "status": "new",
        "created_at": datetime.utcnow()
    }
    
    result = await contact_collection.insert_one(new_message)
    
    return {
        "message": "Message envoyé avec succès",
        "id": str(result.inserted_id)
    }


@router.get("/messages", response_model=List[ContactMessage])
async def get_all_messages(
    status_filter: str = None,
    admin_user = Depends(get_current_admin_user)
):
    """Get all contact messages (admin only)"""
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    messages = await contact_collection.find(query).sort("created_at", -1).to_list(1000)
    
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    
    return [ContactMessage(**msg) for msg in messages]


@router.put("/messages/{message_id}/status")
async def update_message_status(
    message_id: str,
    new_status: str,
    admin_user = Depends(get_current_admin_user)
):
    """Update message status (admin only)"""
    if not ObjectId.is_valid(message_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID"
        )
    
    if new_status not in ["new", "read", "replied"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )
    
    result = await contact_collection.update_one(
        {"_id": ObjectId(message_id)},
        {"$set": {"status": new_status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    return {"message": "Status updated successfully"}


@router.delete("/messages/{message_id}")
async def delete_message(
    message_id: str,
    admin_user = Depends(get_current_admin_user)
):
    """Delete a contact message (admin only)"""
    if not ObjectId.is_valid(message_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID"
        )
    
    result = await contact_collection.delete_one({"_id": ObjectId(message_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    return {"message": "Message deleted successfully"}
