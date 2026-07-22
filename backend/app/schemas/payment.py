import uuid
from typing import Optional
from pydantic import BaseModel
from app.schemas.base import OrmBase
from app.utils.enums import PaymentStatus, PaymentProvider

class PaymentCreate(BaseModel):
    event_id: uuid.UUID
    template_id: Optional[uuid.UUID] = None
    provider: PaymentProvider = PaymentProvider.KASPI

class PaymentResponse(OrmBase):
    id: uuid.UUID
    event_id: uuid.UUID
    amount_kzt: int
    status: PaymentStatus
    provider: PaymentProvider
    transaction_id: Optional[str]
