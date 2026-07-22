import uuid
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Event, Template, ProgramItem, Location
from app.schemas import EventCreate, EventDraftUpdate, EventCanvasUpdate, ProgramItemCreate, LocationUpdate

class EventService:
    async def create_event(self, db: AsyncSession, payload: EventCreate) -> Event:
        stmt_tmpl = select(Template).where(Template.id == payload.template_id)
        res_tmpl = await db.execute(stmt_tmpl)
        template = res_tmpl.scalar_one_or_none()

        if not template:
            raise HTTPException(status_code=404, detail="Selected template not found")

        slug = f"{payload.event_type}-{uuid.uuid4().hex[:6]}"
        mock_user_id = uuid.UUID("00000000-0000-0000-0000-000000000001")

        event = Event(
            user_id=mock_user_id,
            template_id=payload.template_id,
            title=payload.title,
            slug=slug,
            event_type=payload.event_type,
            event_date=payload.event_date,
            default_lang=payload.default_lang,
            status="draft",
            is_paid=False,
            canvas_json=template.canvas_json or {},
            draft_data={"step": 1}
        )
        db.add(event)
        await db.commit()
        await db.refresh(event)
        return event

    async def save_draft(self, db: AsyncSession, event_id: uuid.UUID, payload: EventDraftUpdate) -> Event:
        stmt = select(Event).where(Event.id == event_id)
        res = await db.execute(stmt)
        event = res.scalar_one_or_none()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        event.draft_data = payload.draft_data
        await db.commit()
        await db.refresh(event)
        return event

    async def save_canvas(self, db: AsyncSession, event_id: uuid.UUID, payload: EventCanvasUpdate) -> Event:
        stmt = select(Event).where(Event.id == event_id)
        res = await db.execute(stmt)
        event = res.scalar_one_or_none()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        event.canvas_json = payload.canvas_json
        await db.commit()
        await db.refresh(event)
        return event

    async def publish_event(self, db: AsyncSession, event_id: uuid.UUID) -> Event:
        stmt = select(Event).where(Event.id == event_id)
        res = await db.execute(stmt)
        event = res.scalar_one_or_none()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        event.status = "published"
        await db.commit()
        await db.refresh(event)
        return event

    async def get_user_events(self, db: AsyncSession) -> List[Event]:
        stmt = select(Event).where(Event.status != "deleted")
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_event_by_slug(self, db: AsyncSession, slug: str) -> Event:
        stmt = select(Event).where(Event.slug == slug)
        result = await db.execute(stmt)
        event = result.scalar_one_or_none()
        if not event:
            raise HTTPException(status_code=404, detail="Event invitation not found")
        return event

    async def add_program_item(self, db: AsyncSession, event_id: uuid.UUID, payload: ProgramItemCreate) -> ProgramItem:
        item = ProgramItem(
            event_id=event_id,
            time_str=payload.time_str,
            title_kk=payload.title_kk,
            title_ru=payload.title_ru,
            description_kk=payload.description_kk,
            description_ru=payload.description_ru,
            icon_name=payload.icon_name,
            sort_order=payload.sort_order
        )
        db.add(item)
        await db.commit()
        await db.refresh(item)
        return item

    async def update_location(self, db: AsyncSession, event_id: uuid.UUID, payload: LocationUpdate) -> Location:
        stmt = select(Location).where(Location.event_id == event_id)
        res = await db.execute(stmt)
        location = res.scalar_one_or_none()

        if not location:
            location = Location(
                event_id=event_id,
                venue_name=payload.venue_name,
                address=payload.address,
                city=payload.city,
                latitude=payload.latitude,
                longitude=payload.longitude,
                yandex_map_url=payload.yandex_map_url,
                google_map_url=payload.google_map_url
            )
            db.add(location)
        else:
            location.venue_name = payload.venue_name
            location.address = payload.address
            location.city = payload.city
            location.latitude = payload.latitude
            location.longitude = payload.longitude
            location.yandex_map_url = payload.yandex_map_url
            location.google_map_url = payload.google_map_url

        await db.commit()
        await db.refresh(location)
        return location

event_service = EventService()
