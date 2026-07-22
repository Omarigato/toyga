import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, BigInteger, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class FileRecord(Base):
    __tablename__ = "files"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False) # Google Drive File ID
    size_bytes: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    mime_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    width_px: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    height_px: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    folder: Mapped[str] = mapped_column(String(100), default="general")
    file_url: Mapped[str] = mapped_column(Text, nullable=False)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
