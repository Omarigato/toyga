import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, t?: (key: string) => string): string {
  if (bytes === 0) return `0 ${t?.("common.bytes") || "Bytes"}`;
  const k = 1024;
  const sizes = [t?.("common.bytes") || "Bytes", t?.("common.kb") || "KB", t?.("common.mb") || "MB", t?.("common.gb") || "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDate(date: string | Date, locale: string = "kk"): string {
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));
}

export function formatDateTime(date: string | Date, locale: string = "kk"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

export function timeAgo(date: string | Date, t?: (key: string) => string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return t?.("common.justNow") || "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}${t?.("common.minutesAgo") || "m ago"}`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}${t?.("common.hoursAgo") || "h ago"}`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}${t?.("common.daysAgo") || "d ago"}`;
  return formatDate(date);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
