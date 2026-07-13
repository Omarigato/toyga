// Thin wrapper around /api/* endpoints
// All components use this instead of direct Supabase calls

const BASE = '/api';

async function apiFetch<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        credentials: 'include', // sends httpOnly cookie for admin routes
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new ApiError(res.status, err.error ?? 'Unknown error');
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
}

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const isUnauthorized = (e: unknown) =>
    e instanceof ApiError && e.status === 401;

// ─── Public API ──────────────────────────────────────────────────────────────

export function getCategories() {
    return apiFetch<Category[]>('/categories');
}

function mapTemplate(t: any): Template {
    return {
        id: parseInt(t.id),
        category_id: t.category_id ? parseInt(t.category_id) : 0,
        category_slug: t.category_slug,
        category_title: t.category_title,
        title: t.title_kk || '',
        description: t.title_ru || '',
        price: parseInt(t.price || '0'),
        extra_price: 400,
        preview_image_url: t.preview_img || '',
        is_free: parseInt(t.price || '0') === 0,
        is_active: !!t.is_active,
        sort_order: parseInt(t.sort_order || '0')
    };
}

export function getTemplates(categorySlug?: string) {
    const qs = categorySlug ? `?category=${categorySlug}` : '';
    return apiFetch<any[]>(`/templates${qs}`).then((list) => list.map(mapTemplate));
}

export function getTemplateById(id: number) {
    return apiFetch<any>(`/templates/${id}`).then(mapTemplate);
}

export function getInvitation(slug: string) {
    return apiFetch<InvitationPublic>(`/events/${slug}`);
}

export function getGuests(invitationId: number) {
    return apiFetch<Guest[]>(`/guests/${invitationId}`);
}

export function submitGuest(data: {
    invitation_id: number;
    name: string;
    rsvp_status: 'yes' | 'no' | 'maybe';
    guest_count: number;
    message?: string;
}) {
    return apiFetch<{ success: true }>(`/guests/${data.invitation_id}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function createOrder(data: {
    template_id?: number;
    invitation_id?: number;
    client_name: string;
    client_phone: string;
    channel: 'whatsapp' | 'telegram';
}) {
    return apiFetch<{ success: true }>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ─── User Events, Guests & Media API ──────────────────────────────────────────

export function getUserEvents() {
    return apiFetch<any[]>('/events');
}

export function createEvent(data: any) {
    return apiFetch<any>('/events', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function updateEvent(id: number, data: any) {
    return apiFetch<any>(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function getEventById(id: number) {
    return apiFetch<any>(`/events/${id}`);
}

export function getInvitationLayout(eventId: number) {
    return apiFetch<{ content: any; rendered_image_url: string | null }>(`/events/${eventId}/invitation`);
}

export function saveInvitationLayout(eventId: number, data: { content: any; rendered_image_data?: string }) {
    return apiFetch<any>(`/events/${eventId}/invitation`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function getEventGuests(eventId: number) {
    return apiFetch<any[]>(`/events/${eventId}/guests`);
}

export function addEventGuest(eventId: number, data: { full_name: string; phone: string; greeting_text?: string }) {
    return apiFetch<any>(`/events/${eventId}/guests`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function importEventGuests(eventId: number, list: Array<{ full_name: string; phone: string; greeting_text?: string }>) {
    return apiFetch<any[]>(`/events/${eventId}/guests/import`, {
        method: 'POST',
        body: JSON.stringify(list),
    });
}

export function deleteGuestContact(guestId: number) {
    return apiFetch<{ success: true }>(`/guests/${guestId}`, {
        method: 'DELETE',
    });
}

export function getEventMedia(eventId: number) {
    return apiFetch<any[]>(`/events/${eventId}/media`);
}

export function addEventMedia(eventId: number, data: { url: string; type: 'image' | 'video'; sort_order?: number }) {
    return apiFetch<any>(`/events/${eventId}/media`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function deleteEventMedia(eventId: number, mediaId: number) {
    return apiFetch<{ success: true }>(`/events/${eventId}/media?mediaId=${mediaId}`, {
        method: 'DELETE',
    });
}

// ─── User Auth API ───────────────────────────────────────────────────────────

export function userOtpRequest(phone: string, purpose: 'login' | 'register' = 'login') {
    return apiFetch<{ success: boolean }>('/auth/otp-request', {
        method: 'POST',
        body: JSON.stringify({ phone, purpose }),
    });
}

export function userOtpVerify(phone: string, code: string, name?: string) {
    return apiFetch<{ success: boolean; user: any }>('/auth/otp-verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code, name }),
    });
}

export function userLogin(data: any) {
    return apiFetch<{ success: boolean; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function userRegister(data: any) {
    return apiFetch<{ success: boolean; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function userGetMe() {
    return apiFetch<{ success: boolean; user: any }>('/auth/me');
}

export function userLogout() {
    return apiFetch<{ success: boolean }>('/auth/logout', {
        method: 'POST',
    });
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export function adminLogin(email: string, password: string) {
    return apiFetch<{ ok: true }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export function adminLogout() {
    return userLogout();
}

export function adminGetMe() {
    return userGetMe();
}

export function adminGetOrders() {
    return apiFetch<Order[]>('/orders');
}

export function adminUpdateOrderStatus(id: number, status: string) {
    return apiFetch<{ success: true }>(`/orders?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

export function adminGetInvitations() {
    return apiFetch<InvitationAdmin[]>('/events');
}

export function adminCreateInvitation(data: CreateInvitationInput) {
    return apiFetch<InvitationAdmin>('/events', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function adminGetAllTemplates() {
    return apiFetch<any[]>('/templates?all=true').then((list) => list.map(mapTemplate));
}

export function adminUpsertTemplate(data: Partial<Template> & { id?: number }) {
    const payload = {
        category_id: data.category_id,
        code: data.category_slug || data.title?.toLowerCase().replace(/\s+/g, '-'),
        title_kk: data.title || '',
        title_ru: data.description || '',
        price: data.price,
        is_premium: data.is_free === false,
        is_active: data.is_active,
        sort_order: data.sort_order,
        preview_img: data.preview_image_url || '',
    };
    if (data.id) {
        return apiFetch<any>(`/templates/${data.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }).then(mapTemplate);
    }
    return apiFetch<any>('/templates', {
        method: 'POST',
        body: JSON.stringify(payload),
    }).then(mapTemplate);
}

export function adminGetCategories() {
    return apiFetch<Category[]>('/categories');
}

export function adminUpsertCategory(data: Partial<Category> & { id?: number }) {
    const payload = {
        slug: data.slug,
        title_kk: data.title_kk || '',
        icon_url: data.image_url,
        sort_order: data.sort_order
    };
    if (data.id) {
        return apiFetch<Category>(`/categories?id=${data.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    }
    return apiFetch<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
    id: number;
    slug: string;
    title_kk: string;
    image_url: string;
    sort_order: number;
}

export interface Template {
    id: number;
    category_id: number;
    category_slug?: string;
    category_title?: string;
    title: string;
    description: string;
    price: number;
    extra_price: number;
    preview_image_url: string;
    is_free: boolean;
    is_active: boolean;
    sort_order: number;
}

export interface InvitationPublic {
    id: number;
    short_slug: string;
    owner_name: string;
    event_type: string;
    event_date: string;
    event_location: string | null;
    event_lat: number | null;
    event_lng: number | null;
    cover_image_url: string | null;
    audio_url: string | null;
    custom_data: Record<string, string>;
    status: 'draft' | 'published';
}

export interface InvitationAdmin extends InvitationPublic {
    owner_phone: string | null;
    template_title?: string;
}

export interface CreateInvitationInput {
    template_id?: number;
    short_slug: string;
    owner_name: string;
    owner_phone?: string;
    event_type: string;
    event_date: string;
    event_location?: string;
    event_lat?: number;
    event_lng?: number;
    cover_image_url?: string;
    audio_url?: string;
    custom_data?: Record<string, string>;
}

export interface Guest {
    id: number;
    invitation_id: number;
    name: string;
    rsvp_status: 'yes' | 'no' | 'maybe';
    guest_count: number;
    message: string | null;
    created_at: string;
}

export interface Order {
    id: number;
    client_name: string;
    client_phone: string;
    channel: 'whatsapp' | 'telegram';
    status: 'new' | 'in_progress' | 'done';
    notes: string | null;
    created_at: string;
    template_title?: string;
}
