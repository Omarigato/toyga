import uuid
from typing import Optional, List
from sqlalchemy import String, Text, Integer, Boolean, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel
from app.utils.enums import TemplateStatus

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class Template(BaseModel):
    __tablename__ = "templates"

    category_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("categories.id"))
    name_kk: Mapped[str] = mapped_column(String(255), nullable=False)
    name_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description_kk: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description_ru: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    preview_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price_kzt: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[TemplateStatus] = mapped_column(SQLEnum(TemplateStatus, name="template_status_enum"), default=TemplateStatus.DRAFT)
    canvas_json: Mapped[dict] = mapped_column(JSON_TYPE, default=dict)

    category: Mapped["Category"] = relationship("Category", back_populates="templates")
    events: Mapped[List["Event"]] = relationship("Event", back_populates="template")
