from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Guest
from app.schemas import GuestRSVP, GuestResponse
from app.utils.enums import GuestStatus

class GuestService:
    async def get_guest_by_slug(self, db: AsyncSession, personal_slug: str) -> Guest:
        stmt = select(Guest).where(Guest.personal_slug == personal_slug)
        result = await db.execute(stmt)
        guest = result.scalar_one_or_none()
        if not guest:
            raise HTTPException(status_code=404, detail="Personal invitation not found")
        return guest

    async def submit_rsvp(self, db: AsyncSession, personal_slug: str, payload: GuestRSVP) -> Guest:
        guest = await self.get_guest_by_slug(db, personal_slug)
        
        guest.status = payload.status
        guest.guests_count = payload.guests_count if payload.status == GuestStatus.ACCEPTED else 0
        guest.comment = payload.comment
        guest.answered_at = datetime.utcnow()

        await db.commit()
        await db.refresh(guest)
        return guest

guest_service = GuestService()
