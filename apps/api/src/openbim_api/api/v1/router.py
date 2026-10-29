"""Version 1 API router. All v1 endpoints are mounted under `/api/v1`."""

from fastapi import APIRouter

from openbim_api.api.v1 import health

api_v1_router = APIRouter()
api_v1_router.include_router(health.router)
