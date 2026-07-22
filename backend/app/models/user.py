from typing import Optional, List
from sqlalchemy import String, Text, Enum as SQLEnum, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel
from app.utils.enums import UserRole, UserStatus

class User(BaseModel):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), unique=True, nullable=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    google_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    telegram_id: Mapped[Optional[int]] = mapped_column(BigInteger, unique=True, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole, name="user_role_enum"), default=UserRole.USER)
    status: Mapped[UserStatus] = mapped_column(SQLEnum(UserStatus, name="user_status_enum"), default=UserStatus.ACTIVE)
    preferred_lang: Mapped[str] = mapped_column(String(5), default="kk")

    events: Mapped[List["Event"]] = relationship("Event", back_populates="user", cascade="all, delete-orphan")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="user")
