import uuid
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import OrmBase

class MusicCreate(BaseModel):
    title: str = Field(..., example="Үйлену той вальсі")
    artist: Optional[str] = None
    category: Optional[str] = "Свадьба"
    audio_url: str
    duration: int = 180
    is_free: bool = True

class MusicResponse(OrmBase):
    id: uuid.UUID
    title: str
    artist: Optional[str]
    category: Optional[str]
    audio_url: str
    duration: int
    is_free: bool
