from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Template, Category

class TemplateService:
    async def list_templates(
        self, 
        db: AsyncSession, 
        category_slug: Optional[str] = None, 
        is_premium: Optional[bool] = None
    ) -> List[Template]:
        query = select(Template).where(Template.status == "published")
        if category_slug:
            query = query.join(Category).where(Category.slug == category_slug)
        if is_premium is not None:
            query = query.where(Template.is_premium == is_premium)

        result = await db.execute(query)
        return result.scalars().all()

    async def get_template_by_slug(self, db: AsyncSession, slug: str) -> Template:
        stmt = select(Template).where(Template.slug == slug)
        result = await db.execute(stmt)
        template = result.scalar_one_or_none()
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return template

template_service = TemplateService()
