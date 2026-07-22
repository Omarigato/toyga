import uuid
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Payment, Event, Template
from app.schemas import PaymentCreate
from app.utils.enums import PaymentStatus

class PaymentService:
    async def create_checkout(self, db: AsyncSession, payload: PaymentCreate) -> Payment:
        stmt_event = select(Event).where(Event.id == payload.event_id)
        res_event = await db.execute(stmt_event)
        event = res_event.scalar_one_or_none()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        amount = 4990  # Default activation price in KZT
        if payload.template_id:
            stmt_tmpl = select(Template).where(Template.id == payload.template_id)
            res_tmpl = await db.execute(stmt_tmpl)
            tmpl = res_tmpl.scalar_one_or_none()
            if tmpl and tmpl.price_kzt > 0:
                amount = tmpl.price_kzt

        tx_id = f"TX-TYG-{uuid.uuid4().hex[:8].upper()}"
        payment = Payment(
            user_id=event.user_id,
            event_id=event.id,
            template_id=payload.template_id,
            amount_kzt=amount,
            status=PaymentStatus.PENDING,
            provider=payload.provider,
            transaction_id=tx_id
        )
        db.add(payment)
        await db.commit()
        await db.refresh(payment)
        return payment

    async def confirm_payment(self, db: AsyncSession, transaction_id: str) -> Payment:
        stmt = select(Payment).where(Payment.transaction_id == transaction_id)
        res = await db.execute(stmt)
        payment = res.scalar_one_or_none()

        if not payment:
            raise HTTPException(status_code=404, detail="Transaction not found")

        payment.status = PaymentStatus.PAID
        payment.paid_at = datetime.utcnow()

        stmt_event = select(Event).where(Event.id == payment.event_id)
        res_event = await db.execute(stmt_event)
        event = res_event.scalar_one_or_none()
        if event:
            event.is_paid = True
            event.status = "published"

        await db.commit()
        await db.refresh(payment)
        return payment

payment_service = PaymentService()
