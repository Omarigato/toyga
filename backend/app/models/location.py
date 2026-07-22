import uuid
from typing import Optional
from sqlalchemy import String, Text, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Location(BaseModel):
    __tablename__ = "locations"

    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"))
    venue_name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Numeric(10, 7), nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Numeric(10, 7), nullable=True)
    gis_map_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # 2GIS Link
    yandex_map_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    google_map_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
