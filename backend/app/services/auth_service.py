import random
from typing import Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import User
from app.schemas.user import UserRegister, UserLogin, GoogleLogin, OTPRequest, OTPVerifyWithProfile, TokenResponse, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token

class AuthService:
    async def register(self, db: AsyncSession, payload: UserRegister) -> TokenResponse:
        stmt = select(User).where(User.email == payload.email)
        res = await db.execute(stmt)
        if res.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="User with this email already exists")

        user = User(
            name=payload.name,
            email=payload.email,
            password_hash=get_password_hash(payload.password),
            phone=payload.phone,
            role="user"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        return TokenResponse(
            access_token=token,
            user_id=str(user.id),
            name=user.name,
            role=user.role.value
        )

    async def login(self, db: AsyncSession, payload: UserLogin) -> TokenResponse:
        stmt = select(User).where(User.email == payload.email)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()

        if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        return TokenResponse(
            access_token=token,
            user_id=str(user.id),
            name=user.name,
            role=user.role.value
        )

    async def google_login(self, db: AsyncSession, payload: GoogleLogin) -> TokenResponse:
        if not payload.email:
            raise HTTPException(status_code=400, detail="Email is required for Google auth")

        stmt = select(User).where(User.email == payload.email)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()

        if not user:
            user = User(
                name=payload.name or "Google User",
                email=payload.email,
                google_id=payload.id_token,
                avatar_url=payload.avatar_url,
                role="user"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        return TokenResponse(
            access_token=token,
            user_id=str(user.id),
            name=user.name,
            role=user.role.value
        )

    async def request_otp(self, payload: OTPRequest) -> Dict[str, Any]:
        code = f"{random.randint(100000, 999999)}"
        print(f"\n🔑 [OTP SERVICE LOG] Phone: {payload.phone} => Code: {code}\n")
        return {
            "message": "OTP verification code sent",
            "phone": payload.phone,
            "test_code": code
        }

    async def verify_otp(self, db: AsyncSession, payload: OTPVerifyWithProfile) -> TokenResponse:
        stmt = select(User).where(User.phone == payload.phone)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            name = payload.name or f"User_{payload.phone[-4:]}"
            user = User(
                name=name,
                phone=payload.phone,
                role="user"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        return TokenResponse(
            access_token=token,
            user_id=str(user.id),
            name=user.name,
            role=user.role.value
        )

auth_service = AuthService()
