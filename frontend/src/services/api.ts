import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for attaching JWT Token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("toyga_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API Helper Endpoints
export const authApi = {
  requestOtp: (phone: string) => api.post("/auth/otp/request", { phone }),
  verifyOtp: (phone: string, code: string, name?: string) => api.post("/auth/otp/verify", { phone, code, name }),
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string, phone?: string) => api.post("/auth/register", { name, email, password, phone }),
  googleLogin: (id_token: string) => api.post("/auth/google", { id_token }),
};

export const templatesApi = {
  list: (categorySlug?: string) => api.get("/templates", { params: { category_slug: categorySlug } }),
  getBySlug: (slug: string) => api.get(`/templates/${slug}`),
};

export const eventsApi = {
  create: (data: { template_id: string; title: string; event_type: string; event_date: string; default_lang?: string }) => api.post("/events", data),
  list: () => api.get("/events"),
  getBySlug: (slug: string) => api.get(`/events/${slug}`),
  saveDraft: (eventId: string, draftData: any) => api.put(`/events/${eventId}/draft`, { draft_data: draftData }),
  saveCanvas: (eventId: string, canvasJson: any) => api.put(`/events/${eventId}/canvas`, { canvas_json: canvasJson }),
  publish: (eventId: string) => api.post(`/events/${eventId}/publish`),
  updateLocation: (eventId: string, locationData: any) => api.put(`/events/${eventId}/location`, locationData),
  addProgramItem: (eventId: string, itemData: any) => api.post(`/events/${eventId}/program`, itemData),
};

export const guestsApi = {
  getPersonalInvite: (personalSlug: string) => api.get(`/guests/invite/${personalSlug}`),
  submitRsvp: (personalSlug: string, status: string, guestsCount: number, comment?: string) =>
    api.post(`/guests/invite/${personalSlug}/rsvp`, { status, guests_count: guestsCount, comment }),
};

export const paymentsApi = {
  checkout: (eventId: string, templateId?: string, provider: string = "kaspi") =>
    api.post("/payments/checkout", { event_id: eventId, template_id: templateId, provider }),
  confirm: (transactionId: string) => api.post(`/payments/${transactionId}/confirm`),
};

export const mediaApi = {
  upload: (file: File, folder: string = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/media/upload?folder=${folder}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (fileId: string) => api.delete(`/media/${fileId}`),
};

export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  listUsers: () => api.get("/admin/users"),
};
