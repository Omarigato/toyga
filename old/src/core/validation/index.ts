/**
 * Validation schemas — barrel export.
 * Shared between API handlers (api/*) and frontend (src/*).
 */

// Centralized constants and enums
export {
  AuthProvider,
  UserStatus,
  AdminRole,
  EventType,
  EventStatus,
  LinkMode,
  AssetType,
  SendStatus,
  NotificationStatus,
  SurveyStatus,
  OrderStatus,
  PaymentMode,
  RenderJobStatus,
  SYSTEM_LIMITS,
  HTTP_STATUS,
  ERROR_CODES,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from '../constants';
export type { SupportedLanguage } from '../constants';

// Common utilities
export {
  phoneSchema,
  normalizePhone,
  paginationSchema,
  idParamSchema,
  slugSchema,
  searchSchema,
} from './common';
export type { PaginationParams, PaginatedResponse } from './common';

// Auth
export {
  registerSchema,
  loginSchema,
  otpRequestSchema,
  otpVerifySchema,
  googleCallbackSchema,
} from './auth';
export type {
  RegisterInput,
  LoginInput,
  OtpRequestInput,
  OtpVerifyInput,
  GoogleCallbackInput,
} from './auth';

// Events
export {
  programItemSchema,
  createEventSchema,
  updateEventSchema,
  submitSurveySchema,
  guestContactSchema,
  bulkGuestImportSchema,
} from './events';
export type {
  CreateEventInput,
  UpdateEventInput,
  SubmitSurveyInput,
  BulkGuestImportInput,
} from './events';

// Templates & Categories
export {
  createCategorySchema,
  updateCategorySchema,
  createTemplateSchema,
  updateTemplateSchema,
  createTemplateAssetSchema,
  saveInvitationSchema,
} from './templates';
export type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  CreateTemplateAssetInput,
  SaveInvitationInput,
} from './templates';
