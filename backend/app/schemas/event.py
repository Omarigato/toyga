import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import OrmBase
from app.utils.enums import EventStatus

class EventCreate(BaseModel):
    template_id: uuid.UUID
    title: str = Field(..., example="Омар & Маржан Үйлену Тойы")
    event_type: str = Field(..., example="uylenu-toy")
    event_date: datetime
    default_lang: str = "kk"

class EventDraftUpdate(BaseModel):
    draft_data: dict = Field(..., description="Step wizard draft progress JSON")

class EventCanvasUpdate(BaseModel):
    canvas_json: dict = Field(..., description="Live canvas layout JSON data")

class EventResponse(OrmBase):
    id: uuid.UUID
    user_id: uuid.UUID
    template_id: uuid.UUID
    title: str
    slug: str
    event_type: str
    event_date: datetime
    default_lang: str
    status: EventStatus
    is_paid: bool
    canvas_json: dict
    draft_data: dict
