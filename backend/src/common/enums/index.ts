export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum EventType {
  WEDDING = 'wedding',
  KYZ_UZATU = 'kyz-uzatu',
  SUNDET = 'sundet',
  BIRTHDAY = 'birthday',
  ANNIVERSARY = 'anniversary',
  CORPORATE = 'corporate',
  BABY_SHOWER = 'baby-shower',
  OTHER = 'other',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TemplateStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum TemplateSource {
  ORIGINAL = 'original',
  CLONED = 'cloned',
  IMPORTED = 'imported',
}

export enum MediaType {
  IMAGE = 'image',
  MUSIC = 'music',
  VIDEO = 'video',
}

export enum GuestStatus {
  PENDING = 'pending',
  INVITED = 'invited',
  VIEWED = 'viewed',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  MAYBE = 'maybe',
}

export enum GuestGroupRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export enum RsvpAnswer {
  YES = 'yes',
  NO = 'no',
  MAYBE = 'maybe',
}

export enum SendStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum NotificationChannel {
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  EMAIL = 'email',
}

export enum NotificationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum WhatsAppStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum TemplateAssetType {
  IMAGE = 'image',
  MUSIC = 'music',
  FONT = 'font',
}
