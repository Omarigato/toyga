from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.schemas import GuestResponse, GuestRSVP, GuestCreate
from app.services.guest_service import guest_service

router = APIRouter(prefix="/guests", tags=["Guest CRM & Personal RSVP"])

@router.get("/invite/{personal_slug}", response_model=GuestResponse, summary="Get Guest Personal Invitation")
async def get_guest_invitation(personal_slug: str, db: AsyncSession = Depends(get_db)):
    return await guest_service.get_guest_by_slug(db, personal_slug)

@router.post("/invite/{personal_slug}/rsvp", response_model=GuestResponse, summary="Submit Guest RSVP Response")
async def submit_guest_rsvp(personal_slug: str, payload: GuestRSVP, db: AsyncSession = Depends(get_db)):
    return await guest_service.submit_rsvp(db, personal_slug, payload)

@router.post("/event/{event_id}/bulk", response_model=List[GuestResponse], summary="Bulk Import Guests for Event")
async def bulk_create_guests(
    event_id: str,
    guests_payload: List[GuestCreate],
    db: AsyncSession = Depends(get_db)
):
    created_guests = []
    for g in guests_payload:
        guest = await guest_service.create_guest(db, event_id, g)
        created_guests.append(guest)
    return created_guests
