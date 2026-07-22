import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import Integer, DateTime, ForeignKey, Enum as SQLEnum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel
from app.utils.enums import PaymentStatus, PaymentProvider

class Payment(BaseModel):
    __tablename__ = "payments"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"))
    template_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("templates.id"), nullable=True)
    amount_kzt: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(SQLEnum(PaymentStatus, name="payment_status_enum"), default=PaymentStatus.PENDING)
    provider: Mapped[PaymentProvider] = mapped_column(SQLEnum(PaymentProvider, name="payment_provider_enum"), default=PaymentProvider.KASPI)
    transaction_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="payments")
    event: Mapped["Event"] = relationship("Event", back_populates="payments")
