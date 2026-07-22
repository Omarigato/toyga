import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel
from app.utils.enums import EventStatus

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class Event(BaseModel):
    __tablename__ = "events"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    template_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("templates.id"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    event_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    default_lang: Mapped[str] = mapped_column(String(5), default="kk")
    status: Mapped[EventStatus] = mapped_column(SQLEnum(EventStatus, name="event_status_enum"), default=EventStatus.DRAFT)
    is_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    
    canvas_json: Mapped[dict] = mapped_column(JSON_TYPE, default=dict)
    draft_data: Mapped[dict] = mapped_column(JSON_TYPE, default=dict)

    user: Mapped["User"] = relationship("User", back_populates="events")
    template: Mapped["Template"] = relationship("Template", back_populates="events")
    guests: Mapped[List["Guest"]] = relationship("Guest", back_populates="event", cascade="all, delete-orphan")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="event")
