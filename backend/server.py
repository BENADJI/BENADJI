from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import routes
from routes.auth_routes import router as auth_router
from routes.course_routes import router as course_router
from routes.enrollment_routes import router as enrollment_router
from routes.stats_routes import router as stats_router
from routes.campus_routes import router as campus_router
from routes.admin_routes import router as admin_router
from routes.contact_routes import router as contact_router
from routes.config_routes import router as config_router
from database import client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="Académie Oftalmo API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Académie Oftalmo API is running"}

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(course_router)
api_router.include_router(enrollment_router)
api_router.include_router(stats_router)
api_router.include_router(campus_router)
api_router.include_router(admin_router)
api_router.include_router(contact_router)
api_router.include_router(config_router)

# Include the api router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()