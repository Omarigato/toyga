import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import OrmBase
from app.utils.enums import GuestStatus

class GuestCreate(BaseModel):
    name: str = Field(..., example="Ержан Асан")
    phone: Optional[str] = Field(None, example="+77771234567")
    group_tag: Optional[str] = Field("general", example="Құдалар")

class GuestRSVP(BaseModel):
    status: GuestStatus = Field(..., example=GuestStatus.ACCEPTED)
    guests_count: int = Field(1, ge=1, le=10, description="Exact number of attending guests")
    comment: Optional[str] = Field(None, example="Құтты болсын!")

class GuestResponse(OrmBase):
    id: uuid.UUID
    event_id: uuid.UUID
    name: str
    phone: Optional[str]
    personal_slug: str
    group_tag: str
    status: GuestStatus
    guests_count: int
    comment: Optional[str]
    answered_at: Optional[datetime]
