export const SYSTEM_LIMITS = {
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 5,
  MAX_OTP_ATTEMPTS: 3,
  IMAGE_MAX_SIZE_BYTES: 15 * 1024 * 1024,
  VIDEO_MAX_SIZE_BYTES: 100 * 1024 * 1024,
  AUDIO_MAX_SIZE_BYTES: 20 * 1024 * 1024,
} as const;

export const SUPPORTED_LANGUAGES = ['kk', 'ru', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'kk';
