export type UserRole = "user" | "admin";
export type UserStatus = "active" | "suspended" | "deleted";
export type TemplateStatus = "draft" | "published" | "archived";
export type EventStatus = "draft" | "published" | "completed" | "cancelled";
export type GuestStatus = "pending" | "accepted" | "declined" | "maybe";
export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentProvider = "kaspi" | "card" | "manual" | "admin_override";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  preferred_lang: string;
  avatar_url?: string;
}

export interface Category {
  id: string;
  name_kk: string;
  name_ru: string;
  slug: string;
  description_kk?: string;
  description_ru?: string;
  image_url?: string;
  sort_order: number;
}

export interface Template {
  id: string;
  category_id: string;
  name_kk: string;
  name_ru: string;
  slug: string;
  description_kk?: string;
  description_ru?: string;
  preview_url?: string;
  price_kzt: number;
  status: TemplateStatus;
  canvas_json: Record<string, any>;
}

export interface Event {
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  slug: string;
  event_type: string;
  event_date: string;
  default_lang: string;
  status: EventStatus;
  is_paid: boolean;
  canvas_json: Record<string, any>;
  draft_data: Record<string, any>;
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  phone?: string;
  personal_slug: string;
  group_tag: string;
  status: GuestStatus;
  guests_count: number;
  comment?: string;
  answered_at?: string;
}

export interface Payment {
  id: string;
  event_id: string;
  amount_kzt: number;
  status: PaymentStatus;
  provider: PaymentProvider;
  transaction_id?: string;
}

export interface Location {
  id: string;
  event_id: string;
  venue_name: string;
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  gis_map_url?: string;
  yandex_map_url?: string;
  google_map_url?: string;
}

export interface ProgramItem {
  id: string;
  event_id: string;
  time_str: string;
  title_kk: string;
  title_ru: string;
  description_kk?: string;
  description_ru?: string;
  icon_name?: string;
  sort_order: number;
}
