/**
 * Shared Enums and Constants for Toyga.kz.
 * Acts as the single source of truth for statuses, types, error codes, and configuration limits.
 * Follows SOLID principles by keeping constant definitions isolated from logic.
 */

// ─── Database & Business Enums ──────────────────────────────────────────────

export enum AuthProvider {
  PASSWORD = 'password',
  PHONE_OTP = 'phone_otp',
  GOOGLE = 'google'
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked'
}

export enum AdminRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

export enum EventType {
  WEDDING = 'wedding',
  KYZ_UZATU = 'kyz_uzatu',
  SUNDET = 'sundet',
  TUSAUKESER = 'tusaukeser',
  MEREY = 'merey',
  BESIK = 'besik',
  BETASHAR = 'betashar',
  CORPORATE = 'corporate',
  OTHER = 'other'
}

export enum EventStatus {
  DRAFT = 'draft',
  PENDING_PAYMENT = 'pending_payment',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum LinkMode {
  SHARED = 'shared',
  PERSONAL = 'personal'
}

export enum AssetType {
  AUDIO = 'audio',
  VIDEO = 'video',
  IMAGE = 'image'
}

export enum SendStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  SENT = 'sent',
  FAILED = 'failed',
  RESEND_NEEDED = 'resend_needed'
}

export enum NotificationStatus {
  QUEUED = 'queued',
  SENT = 'sent',
  FAILED = 'failed'
}

export enum SurveyStatus {
  YES = 'yes',
  NO = 'no',
  MAYBE = 'maybe'
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentMode {
  MANUAL = 'manual',
  AUTO = 'auto'
}

export enum RenderJobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  DONE = 'done',
  FAILED = 'failed'
}

// ─── API & System Configuration ─────────────────────────────────────────────

export const SYSTEM_LIMITS = {
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 5,
  MAX_OTP_ATTEMPTS: 3,
  IMAGE_MAX_SIZE_BYTES: 15 * 1024 * 1024,   // 15MB
  VIDEO_MAX_SIZE_BYTES: 100 * 1024 * 1024,  // 100MB
  AUDIO_MAX_SIZE_BYTES: 20 * 1024 * 1024,   // 20MB
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// ─── Localization & UI Constants ────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = ['kk', 'ru', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'kk';

export const NOTIFICATION_TEMPLATES = {
  OTP: {
    kk: (code: string) => `Toyga.kz: Сіздің кіру кодыңыз: ${code}. Кодты ешкімге бермеңіз. Жарамдылық мерзімі: 5 минут.`,
    ru: (code: string) => `Toyga.kz: Ваш код для входа: ${code}. Никому не передавайте этот код. Действителен: 5 минут.`,
    en: (code: string) => `Toyga.kz: Your login code is: ${code}. Do not share this code with anyone. Valid for: 5 minutes.`
  },
  INVITATION: {
    kk: (salutation: string, link: string) => `${salutation}!\n\nСізді біздің салтанатты тойымыздың қонағы болуға шақырамыз. Төмендегі сілтеме арқылы толық ақпаратты көріп, келетініңізді растауыңызды сұраймыз:\n\n${link}\n\nҚұрметпен, той иелері.`,
    ru: (salutation: string, link: string) => `${salutation}!\n\nПриглашаем вас стать почетным гостем на нашем торжестве. Пожалуйста, пройдите по ссылке ниже, чтобы просмотреть подробную информацию и подтвердить свое присутствие:\n\n${link}\n\nС уважением, хозяева торжества.`,
    en: (salutation: string, link: string) => `${salutation}!\n\nYou are cordially invited to be a guest at our celebration. Please follow the link below to view details and confirm your attendance:\n\n${link}\n\nWarm regards, the hosts.`
  },
  UPDATE: {
    kk: (guestName: string, link: string) => `Құрметті ${guestName}!\n\nТой иелері шақыру мәліметтеріне өзгерістер енгізді. Жаңа ақпаратты келесі сілтеме арқылы көре аласыз:\n\n${link}`,
    ru: (guestName: string, link: string) => `Уважаемый(ая) ${guestName}!\n\nОрганизаторы праздника обновили детали приглашения. Вы можете просмотреть обновленную информацию по следующей ссылке:\n\n${link}`,
    en: (guestName: string, link: string) => `Dear ${guestName}!\n\nThe hosts have updated the invitation details. You can view the updated information at the following link:\n\n${link}`
  }
} as const;
