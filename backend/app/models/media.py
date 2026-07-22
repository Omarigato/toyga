import uuid
from typing import Optional
from sqlalchemy import String, Text, BigInteger, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel
from app.utils.enums import AssetType

class Media(BaseModel):
    __tablename__ = "media"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    event_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=True)
    type: Mapped[AssetType] = mapped_column(SQLEnum(AssetType, name="asset_type_enum"), default=AssetType.IMAGE)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_url: Mapped[str] = mapped_column(Text, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size: Mapped[int] = mapped_column(BigInteger, nullable=False)
