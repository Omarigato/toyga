import type { EventType } from "../types";

export const EVENT_TYPES: Record<EventType, string> = {
  wedding: "eventTypes.wedding",
  "kyz-uzatu": "eventTypes.kyzUzatu",
  sundet: "eventTypes.sundet",
  birthday: "eventTypes.birthday",
  anniversary: "eventTypes.anniversary",
  corporate: "eventTypes.corporate",
  "baby-shower": "eventTypes.babyShower",
  other: "eventTypes.other",
};

export const GUEST_STATUS_COLORS: Record<string, string> = {
  pending: "bg-stone-100 text-stone-600",
  invited: "bg-blue-100 text-blue-700",
  viewed: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  maybe: "bg-purple-100 text-purple-700",
};

export const EVENT_STATUS_COLORS: Record<string, string> = {
  draft: "bg-stone-100 text-stone-600",
  published: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};
