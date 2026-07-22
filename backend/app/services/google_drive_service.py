import json
import io
import logging
from functools import lru_cache
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.file import FileRecord

logger = logging.getLogger("toyga.google_drive")

class GoogleDriveService:
    """Singleton Google Drive Service injected via Dependency Injection."""
    
    def __init__(self):
        self.folder_id = settings.GOOGLE_DRIVE_FOLDER_ID
        self.creds_json = settings.GOOGLE_DRIVE_CREDENTIALS_JSON
        self.service = None
        self._init_service()

    def _init_service(self):
        if not self.creds_json:
            logger.info("⚠️ [GOOGLE DRIVE] Environment credentials not set. Operating in Mock mode.")
            return

        try:
            from google.oauth2 import service_account
            from googleapiclient.discovery import build
            
            creds_data = json.loads(self.creds_json)
            credentials = service_account.Credentials.from_service_account_info(
                creds_data,
                scopes=['https://www.googleapis.com/auth/drive.file']
            )
            self.service = build('drive', 'v3', credentials=credentials)
            logger.info("✅ [GOOGLE DRIVE SERVICE] Client API initialized once for application lifecycle.")
        except Exception as e:
            logger.error(f"❌ [GOOGLE DRIVE SERVICE] Error initializing client: {str(e)}")
            self.service = None

    async def upload_file(self, db: AsyncSession, file_name: str, content: bytes, mime_type: str, folder: str = "general") -> FileRecord:
        file_key = f"gdrive_{file_name.replace(' ', '_')}"
        public_url = f"https://drive.google.com/uc?id={file_key}&export=view"

        if self.service:
            try:
                from googleapiclient.http import MediaIoBaseUpload
                file_metadata = {
                    'name': file_name,
                    'parents': [self.folder_id] if self.folder_id else []
                }
                media = MediaIoBaseUpload(io.BytesIO(content), mimetype=mime_type, resumable=True)
                uploaded_file = self.service.files().create(
                    body=file_metadata,
                    media_body=media,
                    fields='id'
                ).execute()

                file_key = uploaded_file.get('id')
                permission = {'type': 'anyone', 'role': 'reader'}
                self.service.permissions().create(fileId=file_key, body=permission).execute()
                public_url = f"https://drive.google.com/uc?id={file_key}&export=view"
            except Exception as e:
                logger.error(f"❌ [GOOGLE DRIVE UPLOAD] Error: {str(e)}")

        file_rec = FileRecord(
            original_name=file_name,
            file_key=file_key,
            size_bytes=len(content),
            mime_type=mime_type,
            folder=folder,
            file_url=public_url
        )
        db.add(file_rec)
        await db.commit()
        await db.refresh(file_rec)
        return file_rec

    async def delete_file(self, db: AsyncSession, file_id: str) -> bool:
        stmt = select(FileRecord).where(FileRecord.id == file_id)
        res = await db.execute(stmt)
        file_rec = res.scalar_one_or_none()

        if not file_rec:
            return False

        if self.service and file_rec.file_key:
            try:
                self.service.files().delete(fileId=file_rec.file_key).execute()
            except Exception as e:
                logger.error(f"❌ [GOOGLE DRIVE DELETE] Error: {str(e)}")

        await db.delete(file_rec)
        await db.commit()
        return True

@lru_cache()
def get_google_drive_service() -> GoogleDriveService:
    """Dependency Injection provider for GoogleDriveService singleton."""
    return GoogleDriveService()
