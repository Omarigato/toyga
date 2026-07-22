from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.user import UserRegister, UserLogin, GoogleLogin, OTPRequest, OTPVerifyWithProfile, TokenResponse
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Auth, Registration & Login"])

@router.post("/register", response_model=TokenResponse, summary="Register new user with Email & Password")
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    return await auth_service.register(db, payload)

@router.post("/login", response_model=TokenResponse, summary="Login with Email & Password")
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    return await auth_service.login(db, payload)

@router.post("/google", response_model=TokenResponse, summary="Login / Register via Google OAuth")
async def google_login(payload: GoogleLogin, db: AsyncSession = Depends(get_db)):
    return await auth_service.google_login(db, payload)

@router.post("/otp/request", summary="Request OTP code for Phone verification")
async def request_otp(payload: OTPRequest):
    return await auth_service.request_otp(payload)

@router.post("/otp/verify", response_model=TokenResponse, summary="Verify OTP code & create profile with Phone & Name")
async def verify_otp(payload: OTPVerifyWithProfile, db: AsyncSession = Depends(get_db)):
    return await auth_service.verify_otp(db, payload)
