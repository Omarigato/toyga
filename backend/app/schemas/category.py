import uuid
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import OrmBase

class CategoryCreate(BaseModel):
    name_kk: str = Field(..., example="Үйлену той")
    name_ru: str = Field(..., example="Свадьба")
    slug: str = Field(..., example="uylenu-toy")
    description_kk: Optional[str] = None
    description_ru: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = 0

class CategoryResponse(OrmBase):
    id: uuid.UUID
    name_kk: str
    name_ru: str
    slug: str
    description_kk: Optional[str]
    description_ru: Optional[str]
    image_url: Optional[str]
    sort_order: int
