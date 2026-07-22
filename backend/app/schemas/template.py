import uuid
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import OrmBase
from app.utils.enums import TemplateStatus

class TemplateCreate(BaseModel):
    category_id: uuid.UUID
    name_kk: str = Field(..., example="Алтын Шатыр Luxe")
    name_ru: str = Field(..., example="Золотой Шатер Luxe")
    slug: str = Field(..., example="altyn-shatyr-luxe")
    description_kk: Optional[str] = None
    description_ru: Optional[str] = None
    preview_url: Optional[str] = None
    price_kzt: int = 0
    is_premium: bool = False
    canvas_json: dict = Field(default_factory=dict)

class TemplateResponse(OrmBase):
    id: uuid.UUID
    category_id: uuid.UUID
    name_kk: str
    name_ru: str
    slug: str
    description_kk: Optional[str]
    description_ru: Optional[str]
    preview_url: Optional[str]
    price_kzt: int
    is_premium: bool
    status: TemplateStatus
    canvas_json: dict
