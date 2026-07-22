from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.google_drive_service import get_google_drive_service, GoogleDriveService

router = APIRouter(prefix="/media", tags=["Media Upload & Google Drive File Management"])

@router.post("/upload", summary="Upload Image/Audio File to Google Drive")
async def upload_media_file(
    file: UploadFile = File(...), 
    folder: str = "general",
    db: AsyncSession = Depends(get_db),
    drive_service: GoogleDriveService = Depends(get_google_drive_service)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename required")
        
    content = await file.read()
    if len(content) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 25MB limit")
        
    file_rec = await drive_service.upload_file(
        db=db,
        file_name=file.filename,
        content=content,
        mime_type=file.content_type or "application/octet-stream",
        folder=folder
    )
    return {
        "status": "success",
        "file_id": str(file_rec.id),
        "file_key": file_rec.file_key,
        "file_name": file_rec.original_name,
        "file_url": file_rec.file_url,
        "mime_type": file_rec.mime_type,
        "size": file_rec.size_bytes
    }

@router.delete("/{file_id}", summary="Delete File from Google Drive & System Storage")
async def delete_media_file(
    file_id: str, 
    db: AsyncSession = Depends(get_db),
    drive_service: GoogleDriveService = Depends(get_google_drive_service)
):
    success = await drive_service.delete_file(db, file_id)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"status": "success", "message": "File deleted successfully", "file_id": file_id}
