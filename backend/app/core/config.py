import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Toyga.kz SaaS Digital Invitation Platform API"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"
    
    # PostgreSQL Database Credentials
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "toyga_db"
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        
    @property
    def SYNC_DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # JWT Authentication
    SECRET_KEY: str = "SUPER_SECRET_TOYGA_JWT_KEY_2026_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # OTP Provider Mode: 'mock', 'telegram', 'whatsapp'
    OTP_PROVIDER_MODE: str = "mock"
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    
    # Google Drive API File Upload Configuration (via Environment Variables)
    GOOGLE_DRIVE_CREDENTIALS_JSON: Optional[str] = None
    GOOGLE_DRIVE_FOLDER_ID: Optional[str] = None
    
    DEFAULT_LANGUAGE: str = "kk"
    SUPPORTED_LANGUAGES: list[str] = ["kk", "ru"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
