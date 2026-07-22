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
        import os
        creds_data = None

        if self.creds_json:
            try:
                if os.path.exists(self.creds_json):
                    with open(self.creds_json, "r", encoding="utf-8") as f:
                        creds_data = json.load(f)
                else:
                    creds_data = json.loads(self.creds_json)
            except Exception as e:
                logger.error(f"❌ [GOOGLE DRIVE SERVICE] Error parsing creds JSON: {e}")

        if not creds_data:
            logger.info("⚠️ [GOOGLE DRIVE] Environment credentials not set or invalid. Operating in Mock mode.")
            return

        try:
            from google.oauth2 import service_account
            from googleapiclient.discovery import build
            
            credentials = service_account.Credentials.from_service_account_info(
                creds_data,
                scopes=['https://www.googleapis.com/auth/drive.file']
            )
            self.service = build('drive', 'v3', credentials=credentials)
            logger.info("✅ [GOOGLE DRIVE SERVICE] Client API initialized once for application lifecycle.")
        except Exception as e:
            logger.error(f"❌ [GOOGLE DRIVE SERVICE] Error initializing client: {str(e)}")
            self.service = None

    def get_target_folder_id(self, folder: str, mime_type: str = "") -> Optional[str]:
        folder_lower = folder.lower()
        if "template" in folder_lower and ("photo" in folder_lower or "image" in mime_type):
            return settings.DRIVE_FOLDER_TEMPLATES_PHOTOS or self.folder_id
        elif "template" in folder_lower and ("video" in folder_lower or "video" in mime_type):
            return settings.DRIVE_FOLDER_TEMPLATES_VIDEOS or self.folder_id
        elif "template" in folder_lower and ("audio" in folder_lower or "music" in folder_lower or "audio" in mime_type):
            return settings.DRIVE_FOLDER_TEMPLATES_AUDIOS or self.folder_id
        elif "client" in folder_lower and ("photo" in folder_lower or "image" in mime_type):
            return settings.DRIVE_FOLDER_CLIENT_PHOTOS or self.folder_id
        elif "client" in folder_lower and ("video" in folder_lower or "video" in mime_type):
            return settings.DRIVE_FOLDER_CLIENT_VIDEOS or self.folder_id
        
        # Exact category match check
        folder_map = {
            "templates_photos": settings.DRIVE_FOLDER_TEMPLATES_PHOTOS,
            "templates_videos": settings.DRIVE_FOLDER_TEMPLATES_VIDEOS,
            "templates_audios": settings.DRIVE_FOLDER_TEMPLATES_AUDIOS,
            "client_photos": settings.DRIVE_FOLDER_CLIENT_PHOTOS,
            "client_videos": settings.DRIVE_FOLDER_CLIENT_VIDEOS,
        }
        return folder_map.get(folder_lower) or self.folder_id

    async def upload_file(self, db: AsyncSession, file_name: str, content: bytes, mime_type: str, folder: str = "general") -> FileRecord:
        file_key = f"gdrive_{file_name.replace(' ', '_')}"
        public_url = f"https://drive.google.com/uc?id={file_key}&export=view"

        target_folder = self.get_target_folder_id(folder, mime_type)

        if self.service:
            try:
                from googleapiclient.http import MediaIoBaseUpload
                file_metadata = {
                    'name': file_name,
                    'parents': [target_folder] if target_folder else []
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
