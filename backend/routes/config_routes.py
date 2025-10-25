from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from database import db
from dependencies import get_current_admin_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/config", tags=["Configuration"])
config_collection = db.site_config


class ThemeConfig(BaseModel):
    siteName: str
    siteTagline: str
    primaryColor: str
    secondaryColor: str
    accentColor: str
    logoUrl: Optional[str] = ""
    heroTitle: str
    heroSubtitle: str
    footerText: str
    contactEmail: str
    contactPhone: str
    whatsappNumber: str


class PageContent(BaseModel):
    page_name: str  # 'home', 'about', 'contact'
    sections: Dict[str, Any]  # Flexible structure for different sections


@router.get("/theme")
async def get_theme_config():
    """Get current theme configuration"""
    config = await config_collection.find_one({"type": "theme"})
    
    if not config:
        # Return default config
        default_config = {
            "type": "theme",
            "siteName": "Academy OMS",
            "siteTagline": "Plateforme de Formation en Ophtalmologie",
            "primaryColor": "#14b8a6",
            "secondaryColor": "#06b6d4",
            "accentColor": "#f59e0b",
            "logoUrl": "",
            "heroTitle": "APPRENONS ENSEMBLE",
            "heroSubtitle": "Devenez le chirurgien que vous voulez être",
            "footerText": "Donner aux ophtalmologistes du monde entier une formation et une éducation de pointe.",
            "contactEmail": "info@academy.oms-dz.com",
            "contactPhone": "+213 (0) 555 123 456",
            "whatsappNumber": "525512915514",
            "updated_at": datetime.utcnow()
        }
        result = await config_collection.insert_one(default_config)
        default_config["_id"] = str(result.inserted_id)
        return default_config
    
    config["_id"] = str(config["_id"])
    return config


@router.put("/theme")
async def update_theme_config(
    theme_config: ThemeConfig,
    admin_user = Depends(get_current_admin_user)
):
    """Update theme configuration"""
    config_data = theme_config.dict()
    config_data["type"] = "theme"
    config_data["updated_at"] = datetime.utcnow()
    config_data["updated_by"] = admin_user.id
    
    existing = await config_collection.find_one({"type": "theme"})
    
    if existing:
        await config_collection.update_one(
            {"type": "theme"},
            {"$set": config_data}
        )
    else:
        await config_collection.insert_one(config_data)
    
    return {"message": "Configuration sauvegardée avec succès"}


@router.get("/page/{page_name}")
async def get_page_content(page_name: str):
    """Get content for a specific page"""
    content = await config_collection.find_one({
        "type": "page_content",
        "page_name": page_name
    })
    
    if not content:
        return {"page_name": page_name, "sections": {}}
    
    content["_id"] = str(content["_id"])
    return content


@router.put("/page")
async def update_page_content(
    page_content: PageContent,
    admin_user = Depends(get_current_admin_user)
):
    """Update page content"""
    content_data = page_content.dict()
    content_data["type"] = "page_content"
    content_data["updated_at"] = datetime.utcnow()
    content_data["updated_by"] = admin_user.id
    
    existing = await config_collection.find_one({
        "type": "page_content",
        "page_name": page_content.page_name
    })
    
    if existing:
        await config_collection.update_one(
            {
                "type": "page_content",
                "page_name": page_content.page_name
            },
            {"$set": content_data}
        )
    else:
        await config_collection.insert_one(content_data)
    
    return {"message": "Contenu de la page sauvegardé avec succès"}


@router.get("/pages/list")
async def get_all_pages(admin_user = Depends(get_current_admin_user)):
    """Get list of all editable pages"""
    pages = await config_collection.find({"type": "page_content"}).to_list(1000)
    
    for page in pages:
        page["_id"] = str(page["_id"])
    
    return pages
