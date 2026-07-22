import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Toyga.kz SaaS Digital Invitation Platform API"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "toyga_db"
    POSTGRES_SSL: bool = True
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        ssl_query = "?ssl=require" if (self.POSTGRES_SSL or "neon.tech" in self.POSTGRES_HOST) else ""
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}{ssl_query}"
        
    @property
    def SYNC_DATABASE_URL(self) -> str:
        ssl_query = "?ssl=require" if (self.POSTGRES_SSL or "neon.tech" in self.POSTGRES_HOST) else ""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}{ssl_query}"

    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "DEV_ONLY_INSECURE_TOYGA_JWT_SECRET_CHANGE_IN_PROD"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    def model_post_init(self, __context):
        if self.ENVIRONMENT.lower() == "production" and "DEV_ONLY" in self.SECRET_KEY:
            raise ValueError("CRITICAL SECURITY ERROR: SECRET_KEY must be set in .env for production environment!")
    
    # OTP Provider Mode: 'mock', 'telegram', 'whatsapp'
    OTP_PROVIDER_MODE: str = "mock"
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    
    # Google Drive API File Upload Configuration
    GOOGLE_DRIVE_CREDENTIALS_JSON: Optional[str] = None
    GOOGLE_DRIVE_FOLDER_ID: Optional[str] = None

    # Google Drive Category Folders
    DRIVE_FOLDER_TEMPLATES_PHOTOS: Optional[str] = None
    DRIVE_FOLDER_TEMPLATES_VIDEOS: Optional[str] = None
    DRIVE_FOLDER_TEMPLATES_AUDIOS: Optional[str] = None
    DRIVE_FOLDER_CLIENT_PHOTOS: Optional[str] = None
    DRIVE_FOLDER_CLIENT_VIDEOS: Optional[str] = None
    
    DEFAULT_LANGUAGE: str = "kk"
    SUPPORTED_LANGUAGES: list[str] = ["kk", "ru"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
