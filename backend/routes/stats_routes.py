from fastapi import APIRouter, HTTPException, status, Depends
from models import Stats, StatsUpdate
from database import stats_collection
from dependencies import get_current_admin_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/stats", tags=["Statistics"])


@router.get("", response_model=Stats)
async def get_stats():
    stats = await stats_collection.find_one()
    
    if not stats:
        # Create default stats if none exist
        default_stats = {
            "webinar_listeners": 2500,
            "virtual_classes": 150,
            "key_opinion_leaders": 45,
            "subscribers": 8000,
            "updated_at": datetime.utcnow()
        }
        result = await stats_collection.insert_one(default_stats)
        default_stats["_id"] = str(result.inserted_id)
        return Stats(**default_stats)
    
    stats["_id"] = str(stats["_id"])
    return Stats(**stats)


@router.put("", response_model=Stats)
async def update_stats(
    stats_data: StatsUpdate,
    admin_user = Depends(get_current_admin_user)
):
    stats = await stats_collection.find_one()
    
    update_data = {
        **stats_data.dict(),
        "updated_at": datetime.utcnow()
    }
    
    if stats:
        result = await stats_collection.find_one_and_update(
            {"_id": stats["_id"]},
            {"$set": update_data},
            return_document=True
        )
    else:
        result_insert = await stats_collection.insert_one(update_data)
        result = await stats_collection.find_one({"_id": result_insert.inserted_id})
    
    result["_id"] = str(result["_id"])
    return Stats(**result)
