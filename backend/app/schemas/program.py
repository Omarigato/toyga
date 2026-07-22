import uuid
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import OrmBase

class ProgramItemCreate(BaseModel):
    time_str: str = Field(..., example="18:00")
    title_kk: str = Field(..., example="Қонақтардың жиналуы")
    title_ru: str = Field(..., example="Сбор гостей")
    description_kk: Optional[str] = None
    description_ru: Optional[str] = None
    icon_name: Optional[str] = "clock"
    sort_order: int = 0

class ProgramItemResponse(OrmBase):
    id: uuid.UUID
    event_id: uuid.UUID
    time_str: str
    title_kk: str
    title_ru: str
    description_kk: Optional[str]
    description_ru: Optional[str]
    icon_name: Optional[str]
    sort_order: int
