from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas import TemplateResponse
from app.services.template_service import template_service

router = APIRouter(prefix="/templates", tags=["Template Marketplace"])

@router.get("", response_model=List[TemplateResponse], summary="List Template Marketplace")
async def list_templates(
    category_slug: Optional[str] = Query(None),
    is_premium: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    return await template_service.list_templates(db, category_slug, is_premium)

@router.get("/{slug}", response_model=TemplateResponse, summary="Get Template Details")
async def get_template(slug: str, db: AsyncSession = Depends(get_db)):
    return await template_service.get_template_by_slug(db, slug)
