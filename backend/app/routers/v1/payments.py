from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas import PaymentCreate, PaymentResponse
from app.services.payment_service import payment_service

router = APIRouter(prefix="/payments", tags=["Single Purchase Payments"])

@router.post("/checkout", response_model=PaymentResponse, summary="Initiate Payment Checkout")
async def create_checkout(payload: PaymentCreate, db: AsyncSession = Depends(get_db)):
    return await payment_service.create_checkout(db, payload)

@router.post("/{transaction_id}/confirm", response_model=PaymentResponse, summary="Confirm Payment Callback")
async def confirm_payment(transaction_id: str, db: AsyncSession = Depends(get_db)):
    return await payment_service.confirm_payment(db, transaction_id)
