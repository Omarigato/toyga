from fastapi import APIRouter

from app.routers.v1.auth import router as auth_router
from app.routers.v1.events import router as events_router
from app.routers.v1.guests import router as guests_router
from app.routers.v1.templates import router as templates_router
from app.routers.v1.payments import router as payments_router
from app.routers.v1.media import router as media_router
from app.routers.v1.admin import router as admin_router

router_v1 = APIRouter(prefix="/v1")

router_v1.include_router(auth_router)
router_v1.include_router(events_router)
router_v1.include_router(guests_router)
router_v1.include_router(templates_router)
router_v1.include_router(payments_router)
router_v1.include_router(media_router)
router_v1.include_router(admin_router)
