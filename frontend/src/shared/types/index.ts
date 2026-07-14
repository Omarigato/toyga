// ─── API Response ────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errorCode?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Auth ────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: "user" | "admin";
  status: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ─── Entities ────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  _count?: { templates: number };
  createdAt: string;
}

export interface TemplateAsset {
  id: string;
  type: "image" | "music" | "font";
  url: string;
  name: string;
  metadata: Record<string, unknown>;
}

export interface Template {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  canvasJson: CanvasData;
  animationConfig: AnimationData;
  designTokens: DesignTokens;
  isPremium: boolean;
  status: string;
  // V3: Marketplace
  originalTemplateId: string | null;
  clonedBy: string | null;
  source: "original" | "cloned" | "imported";
  priceKzt: number;
  downloadCount: number;
  ratingAvg: number;
  ratingCount: number;
  category: { id: string; name: string; slug: string };
  assets: TemplateAsset[];
  createdAt: string;
}

export interface Event {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  slug: string;
  eventType: string;
  eventDate: string;
  location: string | null;
  description: string | null;
  status: "draft" | "published" | "completed" | "cancelled";
  template: { id: string; name: string; slug: string; thumbnailUrl: string | null };
  eventContents?: EventContent[];
  guests?: Guest[];
  invitationLinks?: InvitationLink[];
  _count?: { guests: number };
  createdAt: string;
}

export interface EventContent {
  id: string;
  eventId: string;
  canvasJson: CanvasData;
  contentJson: Record<string, unknown>;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  phone: string | null;
  email: string | null;
  personalSlug: string;
  customMessage: string | null;
  status: GuestStatus;
  // V3: Telegram
  telegramUsername: string | null;
  // V3: Groups
  groupKey: string | null;
  groupRole: "primary" | "secondary";
  partnerGuestId: string | null;
  partnerGuest?: { id: string; name: string } | null;
  // V3: Multi-channel send status
  whatsappStatus: SendStatus;
  whatsappSentAt: string | null;
  whatsappError: string | null;
  telegramStatus: SendStatus;
  telegramSentAt: string | null;
  telegramError: string | null;
  emailStatus: SendStatus;
  emailSentAt: string | null;
  emailError: string | null;
  // V3: RSVP
  rsvpStatus: RsvpStatus;
  rsvpComment: string | null;
  rsvpAnsweredAt: string | null;
  sortOrder: number;
  rsvp: Rsvp[];
  invitationLinks: InvitationLink[];
  createdAt: string;
}

export type GuestStatus = "pending" | "invited" | "viewed" | "confirmed" | "declined" | "maybe";
export type SendStatus = "pending" | "sent" | "delivered" | "failed";
export type RsvpStatus = "pending" | "confirmed" | "declined" | "maybe";

export interface Rsvp {
  id: string;
  answer: "yes" | "no" | "maybe";
  comment: string | null;
  createdAt: string;
}

export interface InvitationLink {
  id: string;
  eventId: string;
  guestId: string | null;
  slug: string;
  isPersonal: boolean;
  guest?: { id: string; name: string };
  createdAt: string;
}

export interface Media {
  id: string;
  userId: string;
  eventId: string | null;
  type: "image" | "music" | "video";
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ─── Editor Types ────────────────────────────────────────────────────────
export interface CanvasData {
  width: number;
  height: number;
  background: string;
  blocks: CanvasBlock[];
}

export interface CanvasBlock {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  content?: string;
  src?: string;
  style: BlockStyle;
}

export type BlockType = "text" | "image" | "qr" | "countdown" | "map" | "schedule" | "divider" | "spacer";

export interface BlockStyle {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  borderRadius?: number;
  padding?: number;
  shadow?: string;
}

export interface AnimationData {
  timeline: AnimationStep[];
  global: { duration: number; easing: string };
}

export interface AnimationStep {
  blockId?: string;
  type: string;
  delay?: number;
  duration?: number;
  direction?: string;
  distance?: number;
  speed?: number;
  trigger?: string;
}

export interface DesignTokens {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, number>;
}

// ─── Event Types ─────────────────────────────────────────────────────────
export type EventType = "wedding" | "kyz-uzatu" | "sundet" | "birthday" | "anniversary" | "corporate" | "baby-shower" | "other";

// ─── V3: Dictionary ─────────────────────────────────────────────────────
export interface DictionaryEntry {
  id: string;
  category: string;
  key: string;
  value: Record<string, unknown>;
  label: string | null;
  labelRu: string | null;
  labelEn: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

// ─── V3: App Settings ───────────────────────────────────────────────────
export interface AppSetting {
  id: string;
  key: string;
  value: unknown;
  category: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── V3: Notification Templates ─────────────────────────────────────────
export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject: string | null;
  body: string;
  htmlBody: string | null;
  variables: string[];
  isDefault: boolean;
  isActive: boolean;
  eventType: string | null;
  createdAt: string;
}

// ─── V3: Notification Queue ─────────────────────────────────────────────
export interface NotificationJob {
  id: string;
  eventId: string;
  guestId: string | null;
  channel: NotificationChannel;
  recipient: string;
  subject: string | null;
  message: string;
  htmlMessage: string | null;
  mediaUrls: string[];
  templateId: string | null;
  templateVars: Record<string, string>;
  status: NotificationStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  attempts: number;
  maxAttempts: number;
  errorMessage: string | null;
  createdAt: string;
}

export type NotificationChannel = "whatsapp" | "telegram" | "email";
export type NotificationStatus = "pending" | "processing" | "sent" | "delivered" | "failed" | "cancelled";

// ─── V3: Guest Group ────────────────────────────────────────────────────
export interface GuestGroup {
  key: string;
  label: string;
  primaryGuest: Guest;
  members: Guest[];
}

// ─── V3: Send Status Summary ────────────────────────────────────────────
export interface SendStatusSummary {
  total: number;
  whatsapp: { pending: number; sent: number; delivered: number; failed: number };
  telegram: { pending: number; sent: number; delivered: number; failed: number };
  email: { pending: number; sent: number; delivered: number; failed: number };
  rsvp: { pending: number; confirmed: number; declined: number; maybe: number };
}

// ─── V3: Channels Status ────────────────────────────────────────────────
export interface ChannelsStatus {
  whatsapp: boolean;
  telegram: boolean;
  email: boolean;
}
