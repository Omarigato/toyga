import enum

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DELETED = "deleted"

class TemplateStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class EventStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class GuestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    MAYBE = "maybe"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"

class PaymentProvider(str, enum.Enum):
    KASPI = "kaspi"
    CARD = "card"
    MANUAL = "manual"
    ADMIN_OVERRIDE = "admin_override"

class AssetType(str, enum.Enum):
    IMAGE = "image"
    MUSIC = "music"
    FONT = "font"
    VIDEO = "video"
