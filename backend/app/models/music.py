from typing import Optional
from sqlalchemy import String, Text, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Music(BaseModel):
    __tablename__ = "music_library"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    artist: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    audio_url: Mapped[str] = mapped_column(Text, nullable=False)
    duration: Mapped[int] = mapped_column(Integer, default=0)
    is_free: Mapped[bool] = mapped_column(Boolean, default=True)
