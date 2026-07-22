import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel
from app.utils.enums import GuestStatus

class Guest(BaseModel):
    __tablename__ = "guests"

    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    personal_slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    group_tag: Mapped[Optional[str]] = mapped_column(String(100), default="general")
    status: Mapped[GuestStatus] = mapped_column(SQLEnum(GuestStatus, name="guest_status_enum"), default=GuestStatus.PENDING)
    guests_count: Mapped[int] = mapped_column(Integer, default=1)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    answered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    event: Mapped["Event"] = relationship("Event", back_populates="guests")
