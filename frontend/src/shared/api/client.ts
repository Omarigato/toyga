import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { APP_CONFIG } from "../config";

const client = axios.create({
  baseURL: APP_CONFIG.api.baseUrl,
  timeout: APP_CONFIG.api.timeout,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ─── Token Management ────────────────────────────────────────────────────
let accessToken: string | null = null;
let refreshToken: string | null = null;

if (typeof window !== "undefined") {
  accessToken = localStorage.getItem(APP_CONFIG.auth.accessTokenKey);
  refreshToken = localStorage.getItem(APP_CONFIG.auth.refreshTokenKey);
}

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== "undefined") {
    localStorage.setItem(APP_CONFIG.auth.accessTokenKey, access);
    localStorage.setItem(APP_CONFIG.auth.refreshTokenKey, refresh);
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(APP_CONFIG.auth.accessTokenKey);
    localStorage.removeItem(APP_CONFIG.auth.refreshTokenKey);
  }
}

export function getAccessToken() {
  return accessToken;
}

// ─── Interceptors ────────────────────────────────────────────────────────
client.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry && refreshToken) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${APP_CONFIG.api.baseUrl}/auth/refresh`, { refreshToken });
        if (data.accessToken) {
          setTokens(data.accessToken, data.refreshToken || refreshToken);
          if (original.headers) {
            original.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          return client(original);
        }
      } catch {
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Typed API Methods ───────────────────────────────────────────────────
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    client.get<T>(url, config).then((r: AxiosResponse<T>) => r.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    client.post<T>(url, data, config).then((r: AxiosResponse<T>) => r.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    client.put<T>(url, data, config).then((r: AxiosResponse<T>) => r.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    client.patch<T>(url, data, config).then((r: AxiosResponse<T>) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    client.delete<T>(url, config).then((r: AxiosResponse<T>) => r.data),

  upload: <T>(url: string, formData: FormData, onProgress?: (p: number) => void) =>
    client.post<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    }).then((r: AxiosResponse<T>) => r.data),
};

export default client;
