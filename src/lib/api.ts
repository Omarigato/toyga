import { supabase } from './supabase';
import {
    invitationCategories,
    photoTemplates,
    blogArticles,
    type Category,
    type Template,
    type BlogArticle,
} from '@/mocks/homeData';

// ─── Types from DB ──────────────────────────────────────────────────────────
export interface DBTemplate {
    id: number;
    category_id: number;
    title: string;
    description: string;
    price: number;
    extra_price: number;
    preview_image_url: string;
    is_free: boolean;
    is_active: boolean;
    sort_order: number;
    categories?: { slug: string; title_kk: string };
}

export interface DBCategory {
    id: number;
    slug: string;
    title_kk: string;
    image_url: string;
    sort_order: number;
}

export interface DBInvitation {
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
    templates?: { title: string; preview_image_url: string } | null;
}

export interface DBGuest {
    id: number;
    invitation_id: number;
    name: string;
    rsvp_status: 'yes' | 'no' | 'maybe';
    guest_count: number;
    message: string | null;
    created_at: string;
}

export interface DBOrder {
    id: number;
    client_name: string;
    client_phone: string;
    channel: 'whatsapp' | 'telegram';
    status: 'new' | 'in_progress' | 'done';
    notes: string | null;
    created_at: string;
    templates?: { title: string } | null;
}

// ─── Mappers from mock format to UI format ──────────────────────────────────
function dbCategoryToMock(c: DBCategory): Category {
    return {
        id: c.id,
        slug: c.slug,
        title: c.title_kk,
        image: c.image_url,
        sort_order: c.sort_order,
    };
}

function dbTemplateToMock(t: DBTemplate): Template {
    return {
        id: t.id,
        category_slug: t.categories?.slug ?? '',
        title: t.title,
        description: t.description ?? '',
        price: t.price === 0 ? 'Тегін' : `${t.price} ₸`,
        extra_price: `+ ${t.extra_price} ₸ жаңарту`,
        whatsapp_text: `Сәлеметсіз бе! "${t.title}" үлгісіне тапсырыс бергім келеді.`,
        preview_image_url: t.preview_image_url,
        is_free: t.is_free,
    };
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
    if (!supabase) return invitationCategories;
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
    if (error || !data?.length) return invitationCategories;
    return data.map(dbCategoryToMock);
}

export async function getTemplates(categorySlug?: string): Promise<Template[]> {
    if (!supabase) {
        if (!categorySlug) return photoTemplates;
        return photoTemplates.filter(t => t.category_slug === categorySlug);
    }

    let query = supabase
        .from('templates')
        .select('*, categories(slug, title_kk)')
        .eq('is_active', true)
        .order('sort_order');

    if (categorySlug) {
        const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();
        if (cat) query = query.eq('category_id', cat.id);
    }

    const { data, error } = await query;
    if (error || !data?.length) {
        if (!categorySlug) return photoTemplates;
        return photoTemplates.filter(t => t.category_slug === categorySlug);
    }
    return (data as DBTemplate[]).map(dbTemplateToMock);
}

export async function getTemplateById(id: number): Promise<DBTemplate | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('templates')
        .select('*, categories(slug, title_kk), template_media(*)')
        .eq('id', id)
        .single();
    if (error) return null;
    return data as DBTemplate;
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
    // Blog is static for now, always return mocks
    return blogArticles;
}

export async function getInvitation(slug: string): Promise<DBInvitation | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('invitations')
        .select('*, templates(title, preview_image_url)')
        .eq('short_slug', slug)
        .eq('status', 'published')
        .single();
    if (error) return null;
    return data as DBInvitation;
}

export async function getInvitationGuests(invitationId: number): Promise<DBGuest[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });
    if (error) return [];
    return data as DBGuest[];
}

export async function submitGuest(data: {
    invitation_id: number;
    name: string;
    rsvp_status: 'yes' | 'no' | 'maybe';
    guest_count: number;
    message?: string;
}): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('guests').insert(data);
    return !error;
}

export async function createOrder(data: {
    client_name: string;
    client_phone: string;
    template_id?: number;
    invitation_id?: number;
    channel: 'whatsapp' | 'telegram';
}): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('orders').insert(data);
    return !error;
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function getAllOrders(): Promise<DBOrder[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('orders')
        .select('*, templates(title)')
        .order('created_at', { ascending: false });
    if (error) return [];
    return data as DBOrder[];
}

export async function updateOrderStatus(id: number, status: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    return !error;
}

export async function getAllInvitations(): Promise<DBInvitation[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('invitations')
        .select('*, templates(title, preview_image_url)')
        .order('created_at', { ascending: false });
    if (error) return [];
    return data as DBInvitation[];
}

export async function createInvitation(data: {
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
    custom_data?: Record<string, string>;
}): Promise<DBInvitation | null> {
    if (!supabase) return null;
    const { data: created, error } = await supabase
        .from('invitations')
        .insert({ ...data, status: 'published' })
        .select()
        .single();
    if (error) return null;
    return created as DBInvitation;
}

export async function getAllTemplatesAdmin(): Promise<DBTemplate[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('templates')
        .select('*, categories(slug, title_kk)')
        .order('sort_order');
    if (error) return [];
    return data as DBTemplate[];
}

export async function upsertTemplate(template: Partial<DBTemplate> & { id?: number }): Promise<boolean> {
    if (!supabase) return false;
    const { error } = template.id
        ? await supabase.from('templates').update(template).eq('id', template.id)
        : await supabase.from('templates').insert(template);
    return !error;
}

export async function getAllCategoriesAdmin(): Promise<DBCategory[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
    if (error) return [];
    return data as DBCategory[];
}

export async function upsertCategory(cat: Partial<DBCategory> & { id?: number }): Promise<boolean> {
    if (!supabase) return false;
    const { error } = cat.id
        ? await supabase.from('categories').update(cat).eq('id', cat.id)
        : await supabase.from('categories').insert(cat);
    return !error;
}
