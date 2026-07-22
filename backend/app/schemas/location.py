import uuid
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import OrmBase

class LocationUpdate(BaseModel):
    venue_name: str = Field(..., example="'Алтын Шатыр Luxe' Рестораны")
    address: str = Field(..., example="Астана қ., Тұран даңғылы 24")
    city: Optional[str] = "Астана"
    latitude: Optional[float] = 51.1605
    longitude: Optional[float] = 71.4704
    gis_map_url: Optional[str] = Field(None, example="https://2gis.kz/astana/firm/70000001018392182")
    yandex_map_url: Optional[str] = None
    google_map_url: Optional[str] = None

class LocationResponse(OrmBase):
    id: uuid.UUID
    event_id: uuid.UUID
    venue_name: str
    address: str
    city: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    gis_map_url: Optional[str]
    yandex_map_url: Optional[str]
    google_map_url: Optional[str]
