from typing import Optional, List
from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel

class Category(BaseModel):
    __tablename__ = "categories"

    name_kk: Mapped[str] = mapped_column(String(100), nullable=False)
    name_ru: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description_kk: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description_ru: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    templates: Mapped[List["Template"]] = relationship("Template", back_populates="category")
