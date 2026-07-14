"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type {
  Event, Template, Guest, Media, Category, InvitationLink,
  DictionaryEntry, AppSetting, NotificationTemplate, NotificationJob,
  GuestGroup, SendStatusSummary, ChannelsStatus,
} from "../types";

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

export function useUpdateGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Guest> }) =>
      api.put(`/guests/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guests"] }),
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

// ─── V3: Dictionary ─────────────────────────────────────────────────────
export function useDictionary(category?: string) {
  return useQuery<DictionaryEntry[]>({
    queryKey: ["dictionary", category],
    queryFn: () => api.get("/dictionary", { params: category ? { category } : undefined }),
  });
}

export function useCreateDictionaryEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { category: string; key: string; value: any; label?: string; labelRu?: string; labelEn?: string }) =>
      api.post("/dictionary", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dictionary"] }),
  });
}

export function useUpdateDictionaryEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DictionaryEntry> }) =>
      api.put(`/dictionary/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dictionary"] }),
  });
}

export function useDeleteDictionaryEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/dictionary/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dictionary"] }),
  });
}

// ─── V3: App Settings ───────────────────────────────────────────────────
export function useAppSettings(category?: string) {
  return useQuery<AppSetting[]>({
    queryKey: ["settings", category],
    queryFn: () => api.get("/settings", { params: category ? { category } : undefined }),
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, category, description }: { key: string; value: any; category?: string; description?: string }) =>
      api.put(`/settings/${key}`, { value, category, description }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useChannelsStatus() {
  return useQuery<ChannelsStatus>({
    queryKey: ["settings", "channels"],
    queryFn: () => api.get("/settings/channels/status"),
  });
}

export function useAdsConfig() {
  return useQuery<{ enabled: boolean; imageUrl: string; bannerUrl: string; height: number; position: string }>({
    queryKey: ["settings", "ads"],
    queryFn: () => api.get("/settings/ads/config"),
  });
}

// ─── V3: Guest Groups ──────────────────────────────────────────────────
export function useGuestGroups(eventId: string) {
  return useQuery<GuestGroup[]>({
    queryKey: ["guest-groups", eventId],
    queryFn: () => api.get(`/guests/event/${eventId}/groups`),
    enabled: !!eventId,
  });
}

// ─── V3: Guest Send Status ──────────────────────────────────────────────
export function useSendStatusSummary(eventId: string) {
  return useQuery<SendStatusSummary>({
    queryKey: ["guests", "send-status", eventId],
    queryFn: () => api.get(`/guests/event/${eventId}/send-status`),
    enabled: !!eventId,
  });
}

export function useUpdateGuestSendStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ guestId, channel, status, error }: {
      guestId: string;
      channel: "whatsapp" | "telegram" | "email";
      status: string;
      error?: string;
    }) => api.put(`/guests/${guestId}/send-status`, { channel, status, error }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guests"] }),
  });
}

// ─── V3: Guest Excel Import/Export ──────────────────────────────────────
export function useGuestExcelTemplate(eventId: string) {
  return useQuery({
    queryKey: ["guests", "excel-template", eventId],
    queryFn: () => api.get(`/guests/template-excel`, { params: { eventId } }),
    enabled: !!eventId,
  });
}

export function useImportGuestsExcel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      api.upload("/guests/import-excel", formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guests"] }),
  });
}

export function useExportGuestsExcel(eventId: string) {
  return useQuery({
    queryKey: ["guests", "export-excel", eventId],
    queryFn: () => api.get(`/guests/export-excel`, { params: { eventId }, responseType: "blob" as any }),
    enabled: !!eventId,
  });
}

// ─── V3: Notifications ──────────────────────────────────────────────────
export function useNotificationTemplates(channel?: string) {
  return useQuery<NotificationTemplate[]>({
    queryKey: ["notification-templates", channel],
    queryFn: () => api.get("/notification-templates", { params: channel ? { channel } : undefined }),
  });
}

export function useNotificationQueue(eventId: string) {
  return useQuery<NotificationJob[]>({
    queryKey: ["notifications", eventId],
    queryFn: () => api.get(`/notifications/event/${eventId}`),
    enabled: !!eventId,
  });
}

export function useSendNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { eventId: string; guestId?: string; channel: string; recipient: string; message: string; templateId?: string; scheduledAt?: string }) =>
      api.post("/notifications/send", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useBroadcastNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { eventId: string; guestIds?: string[]; channel: string; templateId: string; scheduledAt?: string }) =>
      api.post("/notifications/broadcast", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ─── V3: Template Clone ─────────────────────────────────────────────────
export function useCloneTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => api.post(`/templates/${templateId}/clone`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}

// ─── V3: Template Import ────────────────────────────────────────────────
export function useImportTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      api.upload("/templates/import", formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}
