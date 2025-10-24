from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from ..models import Campus, CampusCreate
from ..database import campuses_collection
from ..dependencies import get_current_admin_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/campuses", tags=["Campuses"])


@router.get("", response_model=List[Campus])
async def get_campuses():
    campuses = await campuses_collection.find().to_list(1000)
    
    if not campuses:
        # Create default campuses if none exist
        default_campuses = [
            {
                "name": "Campus México",
                "location": "Mexico City, Roma",
                "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
                "description": "Le campus mexicain de l'Académie Oftalmo, situé dans le quartier de Roma, offre une formation avancée pour les ophtalmologistes, axée sur la chirurgie de la cataracte et d'autres spécialités avec un corps professoral expert et des installations de pointe.",
                "created_at": datetime.utcnow()
            },
            {
                "name": "Campus Europe",
                "location": "Barcelone, Espagne",
                "image": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
                "description": "Le campus européen de l'Académie Oftalmo à Barcelone a ouvert ses portes en février 2025 au sein de la prestigieuse installation IMO. Il servira les professionnels d'Europe, d'Afrique du Nord et du Moyen-Orient.",
                "created_at": datetime.utcnow()
            }
        ]
        await campuses_collection.insert_many(default_campuses)
        campuses = await campuses_collection.find().to_list(1000)
    
    for campus in campuses:
        campus["_id"] = str(campus["_id"])
    
    return [Campus(**campus) for campus in campuses]


@router.post("", response_model=Campus)
async def create_campus(
    campus_data: CampusCreate,
    admin_user = Depends(get_current_admin_user)
):
    new_campus = {
        **campus_data.dict(),
        "created_at": datetime.utcnow()
    }
    
    result = await campuses_collection.insert_one(new_campus)
    new_campus["_id"] = str(result.inserted_id)
    
    return Campus(**new_campus)
