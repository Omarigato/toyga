import uuid
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from app.schemas.base import OrmBase
from app.utils.enums import UserRole, UserStatus

class UserRegister(BaseModel):
    name: str = Field(..., example="Абылай Хан")
    email: EmailStr = Field(..., example="abylai@toyga.kz")
    password: str = Field(..., min_length=6, example="Secret123!")
    phone: Optional[str] = Field(None, example="+77071234567")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="abylai@toyga.kz")
    password: str = Field(..., example="Secret123!")

class GoogleLogin(BaseModel):
    id_token: str = Field(..., description="Google OAuth ID Token")
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None

class OTPRequest(BaseModel):
    phone: str = Field(..., example="+77071234567")

class OTPVerifyWithProfile(BaseModel):
    phone: str = Field(..., example="+77071234567")
    code: str = Field(..., example="123456")
    name: Optional[str] = Field(None, example="Абылай Хан", description="Full Name required on first registration")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    role: str

class UserResponse(OrmBase):
    id: uuid.UUID
    name: str
    email: Optional[str]
    phone: Optional[str]
    role: UserRole
    status: UserStatus
    preferred_lang: str
    avatar_url: Optional[str]
