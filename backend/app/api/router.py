"""API router — aggregates all versioned endpoint routers.

The main entry point for all API routes. Currently includes:
- v1: All /api/v1/* endpoints
"""

from fastapi import APIRouter

from app.api.v1.router import router as v1_router

api_router = APIRouter()
api_router.include_router(v1_router)
