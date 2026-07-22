import uuid
from typing import Optional
from sqlalchemy import String, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class ProgramItem(BaseModel):
    __tablename__ = "program_items"

    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"))
    time_str: Mapped[str] = mapped_column(String(20), nullable=False)
    title_kk: Mapped[str] = mapped_column(String(255), nullable=False)
    title_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    description_kk: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description_ru: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon_name: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
