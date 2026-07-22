from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.v1 import router_v1

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    # TOYGA.KZ V3 — SaaS Digital Invitation Platform API
    
    ## Architecture Specs
    * **Strict Router -> Service -> DB Separation**: Zero database logic inside Routers.
    * **Google Drive API**: File storage for media assets driven by environment variables.
    * **Multi-Language (KK / RU)**: Full localization for digital invitations.
    * **Personal RSVP Engine**: RSVP status ENUMs, exact guest attendance count (`guests_count`), and unified comment logging.
    """,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 Router Bundle
app.include_router(router_v1, prefix="/api")

@app.get("/", summary="API Root Health Status")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "swagger": "/docs",
        "storage": "Google Drive API"
    }
