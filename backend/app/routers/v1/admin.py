from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models import User, Event, Template, Payment

router = APIRouter(prefix="/admin", tags=["SaaS Admin Panel"])

@router.get("/stats", summary="Get Admin Dashboard Metrics")
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    users_count = await db.scalar(select(func.count(User.id)))
    events_count = await db.scalar(select(func.count(Event.id)))
    templates_count = await db.scalar(select(func.count(Template.id)))
    total_revenue = await db.scalar(select(func.coalesce(func.sum(Payment.amount_kzt), 0)).where(Payment.status == "paid"))

    return {
        "total_users": users_count or 0,
        "total_events": events_count or 0,
        "total_templates": templates_count or 0,
        "total_revenue_kzt": total_revenue or 0
    }
