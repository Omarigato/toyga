export const APP_CONFIG = {
  name: "Тойға",
  nameEn: "Toyga",
  description: {
    kk: "Тойыңызға цифровой шақыру жасаңыз",
    ru: "Создавайте цифровые приглашения для торжеств",
    en: "Create digital invitations for your celebrations",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
    timeout: 15000,
  },
  auth: {
    accessTokenKey: "tg_access_token",
    refreshTokenKey: "tg_refresh_token",
  },
  editor: {
    canvasWidth: 1080,
    canvasHeight: 1920,
    maxUndoSteps: 50,
    autosaveIntervalMs: 3000,
  },
  upload: {
    maxImageSize: 15 * 1024 * 1024,
    maxAudioSize: 20 * 1024 * 1024,
    maxVideoSize: 100 * 1024 * 1024,
    acceptedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    acceptedAudioTypes: ["audio/mpeg", "audio/wav", "audio/ogg"],
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
} as const;

export type Locale = "kk" | "ru" | "en";
export const LOCALES: Locale[] = ["kk", "ru", "en"];
export const DEFAULT_LOCALE: Locale = "kk";
