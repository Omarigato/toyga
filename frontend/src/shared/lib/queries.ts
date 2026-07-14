"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Event, Template, Guest, Media, Category, InvitationLink } from "../types";

// ─── Events ──────────────────────────────────────────────────────────────
export function useEvents() {
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => api.get("/events"),
  });
}

export function useEvent(id: string) {
  return useQuery<Event>({
    queryKey: ["events", id],
    queryFn: () => api.get(`/events/${id}`),
    enabled: !!id,
  });
}

export function usePublicEvent(slug: string) {
  return useQuery<Event>({
    queryKey: ["events", "public", slug],
    queryFn: () => api.get(`/events/public/${slug}`),
    enabled: !!slug,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { templateId: string; title: string; eventType: string; eventDate: string; location?: string }) =>
      api.post("/events", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => api.put(`/events/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function usePublishEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/events/${id}/publish`),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}

export function useAutosave() {
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: { canvasJson?: any; contentJson?: any } }) =>
      api.post(`/events/${eventId}/autosave`, data),
  });
}

// ─── Templates ───────────────────────────────────────────────────────────
export function useTemplates(categorySlug?: string) {
  return useQuery<Template[]>({
    queryKey: ["templates", categorySlug],
    queryFn: () => api.get("/templates", { params: categorySlug ? { category: categorySlug } : undefined }),
  });
}

export function useTemplate(id: string) {
  return useQuery<Template>({
    queryKey: ["templates", id],
    queryFn: () => api.get(`/templates/${id}`),
    enabled: !!id,
  });
}

// ─── Categories ──────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories"),
  });
}

// ─── Guests ──────────────────────────────────────────────────────────────
export function useGuests(eventId: string) {
  return useQuery<Guest[]>({
    queryKey: ["guests", eventId],
    queryFn: () => api.get(`/guests/event/${eventId}`),
    enabled: !!eventId,
  });
}

export function useGuestBySlug(slug: string) {
  return useQuery<Guest>({
    queryKey: ["guests", "slug", slug],
    queryFn: () => api.get(`/guests/personal/${slug}`),
    enabled: !!slug,
  });
}

export function useCreateGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { eventId: string; name: string; phone?: string; email?: string; customMessage?: string }) =>
      api.post("/guests", data),
    onSuccess: (_, { eventId }) => qc.invalidateQueries({ queryKey: ["guests", eventId] }),
  });
}

export function useBulkImportGuests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { eventId: string; guests: Array<{ name: string; phone?: string; email?: string }> }) =>
      api.post("/guests/bulk", data),
    onSuccess: (_, { eventId }) => qc.invalidateQueries({ queryKey: ["guests", eventId] }),
  });
}

export function useDeleteGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/guests/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guests"] }),
  });
}

// ─── Invitation Links ────────────────────────────────────────────────────
export function useInvitationLinks(eventId: string) {
  return useQuery<InvitationLink[]>({
    queryKey: ["invitation-links", eventId],
    queryFn: () => api.get(`/invitation-links/event/${eventId}`),
    enabled: !!eventId,
  });
}

export function useCreateGeneralLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { eventId: string; customSlug?: string }) =>
      api.post("/invitation-links/general", data),
    onSuccess: (_, { eventId }) => qc.invalidateQueries({ queryKey: ["invitation-links", eventId] }),
  });
}

export function useCreatePersonalLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { eventId: string; guestId: string }) =>
      api.post("/invitation-links/personal", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitation-links"] }),
  });
}

// ─── Media ───────────────────────────────────────────────────────────────
export function useMedia() {
  return useQuery<Media[]>({
    queryKey: ["media"],
    queryFn: () => api.get("/media"),
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData; onProgress?: (p: number) => void }) =>
      api.upload("/media/upload", formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

// ─── WhatsApp ────────────────────────────────────────────────────────────
export function useWhatsAppMessages(eventId: string) {
  return useQuery({
    queryKey: ["whatsapp", eventId],
    queryFn: () => api.get(`/whatsapp/event/${eventId}`),
    enabled: !!eventId,
  });
}

export function useSendWhatsApp() {
  return useMutation({
    mutationFn: (data: { eventId: string; guestId?: string; phone: string; message: string }) =>
      api.post("/whatsapp/send", data),
  });
}

export function useBroadcastWhatsApp() {
  return useMutation({
    mutationFn: (data: { eventId: string; guests: Array<{ guestId: string; phone: string; message: string }> }) =>
      api.post("/whatsapp/broadcast", data),
  });
}
