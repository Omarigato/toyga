import uuid
from typing import Optional
from pydantic import BaseModel
from app.schemas.base import OrmBase
from app.utils.enums import AssetType

class MediaResponse(OrmBase):
    id: uuid.UUID
    user_id: uuid.UUID
    event_id: Optional[uuid.UUID]
    type: AssetType
    file_name: str
    file_url: str
    mime_type: str
    size: int
