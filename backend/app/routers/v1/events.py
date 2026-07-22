import uuid
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas import (
    EventCreate, EventDraftUpdate, EventCanvasUpdate, EventResponse,
    ProgramItemCreate, ProgramItemResponse, LocationUpdate, LocationResponse
)
from app.services.event_service import event_service

router = APIRouter(prefix="/events", tags=["Events & Invitation Wizard"])

@router.post("", response_model=EventResponse, summary="Create New Event Invitation (Initial Step)")
async def create_event(payload: EventCreate, db: AsyncSession = Depends(get_db)):
    return await event_service.create_event(db, payload)

@router.put("/{event_id}/draft", response_model=EventResponse, summary="Auto-Save Wizard Step Draft Progress")
async def save_event_draft(event_id: uuid.UUID, payload: EventDraftUpdate, db: AsyncSession = Depends(get_db)):
    return await event_service.save_draft(db, event_id, payload)

@router.put("/{event_id}/canvas", response_model=EventResponse, summary="Auto-Save Live Canvas Design Layout JSON")
async def save_event_canvas(event_id: uuid.UUID, payload: EventCanvasUpdate, db: AsyncSession = Depends(get_db)):
    return await event_service.save_canvas(db, event_id, payload)

@router.post("/{event_id}/publish", response_model=EventResponse, summary="Publish Event Invitation")
async def publish_event(event_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await event_service.publish_event(db, event_id)

@router.get("", response_model=List[EventResponse], summary="List User Events (Customer Dashboard)")
async def list_events(db: AsyncSession = Depends(get_db)):
    return await event_service.get_user_events(db)

@router.get("/{slug}", response_model=EventResponse, summary="Get Event Details by Slug")
async def get_event_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    return await event_service.get_event_by_slug(db, slug)

@router.post("/{event_id}/program", response_model=ProgramItemResponse, summary="Add Program Item to Event Schedule")
async def add_program_item(event_id: uuid.UUID, payload: ProgramItemCreate, db: AsyncSession = Depends(get_db)):
    return await event_service.add_program_item(db, event_id, payload)

@router.put("/{event_id}/location", response_model=LocationResponse, summary="Set or Update Venue Location Details")
async def update_location(event_id: uuid.UUID, payload: LocationUpdate, db: AsyncSession = Depends(get_db)):
    return await event_service.update_location(db, event_id, payload)
