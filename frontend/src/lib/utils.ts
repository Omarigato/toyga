import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, lang: string = "kk"): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  const locales: Record<string, string> = {
    kk: "kk-KZ",
    ru: "ru-RU",
    en: "en-US",
  };
  
  return d.toLocaleDateString(locales[lang] || "kk-KZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  return timeStr;
}

export function formatCurrencyKZT(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(amount);
}
