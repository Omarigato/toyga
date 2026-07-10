import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuthGuard } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
    getAllOrders, updateOrderStatus,
    getAllInvitations, createInvitation,
    getAllTemplatesAdmin, upsertTemplate,
    getAllCategoriesAdmin,
    type DBOrder, type DBInvitation, type DBTemplate, type DBCategory,
} from '@/lib/api';
import { generateQRDataURL } from '@/lib/qr';
import { nanoid } from 'nanoid';

// ── Helpers ────────────────────────────────────────────────────────────────────
const TAB_LABELS = [
    { key: 'orders', label: 'Заявки' },
    { key: 'invitations', label: 'Шақырулар' },
    { key: 'templates', label: 'Үлгілер' },
    { key: 'categories', label: 'Санаттар' },
];

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        new: 'bg-blue-100 text-blue-700',
        in_progress: 'bg-yellow-100 text-yellow-700',
        done: 'bg-green-100 text-green-700',
        published: 'bg-green-100 text-green-700',
        draft: 'bg-gray-100 text-gray-600',
    };
    const labels: Record<string, string> = {
        new: 'Жаңа', in_progress: 'Жұмыста', done: 'Дайын',
        published: 'Жарияланған', draft: 'Жоба',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
            {labels[status] ?? status}
        </span>
    );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab() {
    const [orders, setOrders] = useState<DBOrder[]>([]);
    useEffect(() => { getAllOrders().then(setOrders); }, []);

    const changeStatus = async (id: number, status: string) => {
        await updateOrderStatus(id, status);
        setOrders(orders.map(o => o.id === id ? { ...o, status: status as DBOrder['status'] } : o));
    };

    return (
        <div>
            <h2 className="text-xl font-bold font-heading text-foreground-900 mb-6">Тапсырыстар</h2>
            {orders.length === 0 ? (
                <p className="text-foreground-500 text-center py-12">Тапсырыстар жоқ</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-background-200">
                    <table className="w-full text-sm">
                        <thead className="bg-background-100 text-foreground-600 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Клиент</th>
                                <th className="px-4 py-3 text-left">Телефон</th>
                                <th className="px-4 py-3 text-left">Үлгі</th>
                                <th className="px-4 py-3 text-left">Арна</th>
                                <th className="px-4 py-3 text-left">Күн</th>
                                <th className="px-4 py-3 text-left">Мәртебе</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-background-100">
                            {orders.map(o => (
                                <tr key={o.id} className="hover:bg-background-50">
                                    <td className="px-4 py-3 font-medium">{o.client_name}</td>
                                    <td className="px-4 py-3 text-foreground-600">
                                        <a href={`tel:${o.client_phone}`} className="hover:text-accent-600">{o.client_phone}</a>
                                    </td>
                                    <td className="px-4 py-3 text-foreground-600">{o.templates?.title ?? '—'}</td>
                                    <td className="px-4 py-3 capitalize">{o.channel}</td>
                                    <td className="px-4 py-3 text-foreground-500">
                                        {new Date(o.created_at).toLocaleDateString('kk-KZ')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={o.status}
                                            onChange={(e) => changeStatus(o.id, e.target.value)}
                                            className="text-xs border border-background-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                                        >
                                            <option value="new">Жаңа</option>
                                            <option value="in_progress">Жұмыста</option>
                                            <option value="done">Дайын</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ── Invitations Tab ───────────────────────────────────────────────────────────
function InvitationsTab() {
    const [invitations, setInvitations] = useState<DBInvitation[]>([]);
    const [templates, setTemplates] = useState<DBTemplate[]>([]);
    const [categories, setCategories] = useState<DBCategory[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [qrData, setQrData] = useState<{ slug: string; qrUrl: string } | null>(null);
    const [form, setForm] = useState({
        template_id: '',
        owner_name: '',
        owner_phone: '',
        event_type: 'Үйлену той',
        event_date: '',
        event_location: '',
        cover_image_url: '',
        custom_data_description: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getAllInvitations().then(setInvitations);
        getAllTemplatesAdmin().then(setTemplates);
        getAllCategoriesAdmin().then(setCategories);
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const slug = nanoid(6);
        const inv = await createInvitation({
            template_id: form.template_id ? parseInt(form.template_id) : undefined,
            short_slug: slug,
            owner_name: form.owner_name,
            owner_phone: form.owner_phone,
            event_type: form.event_type,
            event_date: form.event_date,
            event_location: form.event_location,
            cover_image_url: form.cover_image_url,
            custom_data: form.custom_data_description ? { description: form.custom_data_description } : {},
        });
        setSaving(false);
        if (inv) {
            const url = `${window.location.origin}/i/${slug}`;
            const qrUrl = await generateQRDataURL(url);
            setQrData({ slug, qrUrl });
            setShowForm(false);
            getAllInvitations().then(setInvitations);
        }
    };

    const eventTypes = ['Үйлену той', 'Қыз ұзату', 'Сүндет той', 'Тұсаукесер', 'Мерей той', 'Бесік той'];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading text-foreground-900">Шақырулар</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors"
                >
                    + Жаңа шақыру
                </button>
            </div>

            {/* QR result */}
            {qrData && (
                <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
                    <p className="text-green-800 font-semibold mb-1">Шақыру сәтті жасалды! 🎉</p>
                    <p className="text-green-700 text-sm mb-4">
                        Сілтеме: <a href={`/i/${qrData.slug}`} target="_blank" className="underline font-mono">/i/{qrData.slug}</a>
                    </p>
                    <img src={qrData.qrUrl} alt="QR код" className="mx-auto w-40 h-40 rounded-xl border border-green-200" />
                    <a
                        href={qrData.qrUrl}
                        download={`qr-${qrData.slug}.png`}
                        className="inline-block mt-3 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                        QR жүктеу
                    </a>
                </div>
            )}

            {/* Create form */}
            {showForm && (
                <form onSubmit={handleCreate} className="mb-6 p-6 bg-background-50 border border-background-200 rounded-2xl space-y-4">
                    <h3 className="font-semibold text-foreground-900">Жаңа шақыру</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Той иесінің аты</label>
                            <input required value={form.owner_name} onChange={e => setForm({...form, owner_name: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Телефон</label>
                            <input value={form.owner_phone} onChange={e => setForm({...form, owner_phone: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Той түрі</label>
                            <select value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm">
                                {eventTypes.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Той күні мен уақыты</label>
                            <input required type="datetime-local" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Орны</label>
                            <input value={form.event_location} onChange={e => setForm({...form, event_location: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" placeholder="Алматы, Достық банкет залы" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Үлгі</label>
                            <select value={form.template_id} onChange={e => setForm({...form, template_id: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm">
                                <option value="">— Таңдамасыз —</option>
                                {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Сурет URL (обложка)</label>
                            <input value={form.cover_image_url} onChange={e => setForm({...form, cover_image_url: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" placeholder="https://..." />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Шақыру мәтіні</label>
                            <textarea value={form.custom_data_description} onChange={e => setForm({...form, custom_data_description: e.target.value})} rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm resize-none" placeholder="Сізді тойымызға шақырамыз..." />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={saving}
                            className="px-6 py-2.5 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors disabled:opacity-60">
                            {saving ? 'Сақталуда...' : 'Жасау & QR алу'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="px-6 py-2.5 rounded-xl bg-background-200 text-foreground-700 text-sm font-medium hover:bg-background-300 transition-colors">
                            Болдырмау
                        </button>
                    </div>
                </form>
            )}

            {/* Invitations table */}
            {invitations.length === 0 ? (
                <p className="text-foreground-500 text-center py-12">Шақырулар жоқ</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-background-200">
                    <table className="w-full text-sm">
                        <thead className="bg-background-100 text-foreground-600 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Иесі</th>
                                <th className="px-4 py-3 text-left">Той түрі</th>
                                <th className="px-4 py-3 text-left">Күні</th>
                                <th className="px-4 py-3 text-left">Мәртебе</th>
                                <th className="px-4 py-3 text-left">Сілтеме</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-background-100">
                            {invitations.map(inv => (
                                <tr key={inv.id} className="hover:bg-background-50">
                                    <td className="px-4 py-3 font-medium">{inv.owner_name}</td>
                                    <td className="px-4 py-3 text-foreground-600">{inv.event_type}</td>
                                    <td className="px-4 py-3 text-foreground-500">
                                        {new Date(inv.event_date).toLocaleDateString('kk-KZ')}
                                    </td>
                                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                                    <td className="px-4 py-3">
                                        <a href={`/i/${inv.short_slug}`} target="_blank"
                                            className="text-accent-600 hover:underline font-mono text-xs">
                                            /i/{inv.short_slug}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ── Templates Tab ─────────────────────────────────────────────────────────────
function TemplatesTab() {
    const [templates, setTemplates] = useState<DBTemplate[]>([]);
    const [categories, setCategories] = useState<DBCategory[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({ title: '', description: '', price: '0', extra_price: '400', preview_image_url: '', category_id: '', is_free: false, is_active: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getAllTemplatesAdmin().then(setTemplates);
        getAllCategoriesAdmin().then(setCategories);
    }, []);

    const openEdit = (t: DBTemplate) => {
        setEditId(t.id);
        setForm({ title: t.title, description: t.description ?? '', price: String(t.price), extra_price: String(t.extra_price), preview_image_url: t.preview_image_url ?? '', category_id: String(t.category_id ?? ''), is_free: t.is_free, is_active: t.is_active });
        setShowForm(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await upsertTemplate({ id: editId ?? undefined, title: form.title, description: form.description, price: parseInt(form.price), extra_price: parseInt(form.extra_price), preview_image_url: form.preview_image_url, category_id: form.category_id ? parseInt(form.category_id) : undefined, is_free: form.is_free, is_active: form.is_active });
        setSaving(false);
        setShowForm(false);
        setEditId(null);
        getAllTemplatesAdmin().then(setTemplates);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading text-foreground-900">Үлгілер</h2>
                <button onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', description: '', price: '0', extra_price: '400', preview_image_url: '', category_id: '', is_free: false, is_active: true }); }}
                    className="px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors">
                    + Жаңа үлгі
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSave} className="mb-6 p-6 bg-background-50 border border-background-200 rounded-2xl space-y-4">
                    <h3 className="font-semibold text-foreground-900">{editId ? 'Өңдеу' : 'Жаңа үлгі'}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Атауы</label>
                            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Санат</label>
                            <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm">
                                <option value="">— Таңдаңыз —</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.title_kk}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Баға (₸, 0=тегін)</label>
                            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Сурет URL</label>
                            <input value={form.preview_image_url} onChange={e => setForm({...form, preview_image_url: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" />
                        </div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={form.is_free} onChange={e => setForm({...form, is_free: e.target.checked})} className="rounded" />
                                Тегін
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded" />
                                Белсенді
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={saving}
                            className="px-6 py-2.5 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors disabled:opacity-60">
                            {saving ? 'Сақталуда...' : 'Сақтау'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="px-6 py-2.5 rounded-xl bg-background-200 text-foreground-700 text-sm font-medium hover:bg-background-300 transition-colors">
                            Болдырмау
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-background-200">
                <table className="w-full text-sm">
                    <thead className="bg-background-100 text-foreground-600 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">Атауы</th>
                            <th className="px-4 py-3 text-left">Санат</th>
                            <th className="px-4 py-3 text-left">Баға</th>
                            <th className="px-4 py-3 text-left">Белсенді</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-background-100">
                        {templates.map(t => (
                            <tr key={t.id} className="hover:bg-background-50">
                                <td className="px-4 py-3 font-medium">{t.title}</td>
                                <td className="px-4 py-3 text-foreground-600">{t.categories?.title_kk ?? '—'}</td>
                                <td className="px-4 py-3">{t.price === 0 ? <span className="text-green-600 font-medium">Тегін</span> : `${t.price} ₸`}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-block w-2 h-2 rounded-full ${t.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => openEdit(t)} className="text-accent-600 hover:underline text-xs">Өңдеу</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── Categories Tab ────────────────────────────────────────────────────────────
function CategoriesTab() {
    const [categories, setCategories] = useState<DBCategory[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ slug: '', title_kk: '', image_url: '', sort_order: '0' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { getAllCategoriesAdmin().then(setCategories); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await upsertCategory({ slug: form.slug, title_kk: form.title_kk, image_url: form.image_url, sort_order: parseInt(form.sort_order) });
        setSaving(false);
        setShowForm(false);
        getAllCategoriesAdmin().then(setCategories);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading text-foreground-900">Санаттар</h2>
                <button onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors">
                    + Жаңа санат
                </button>
            </div>
            {showForm && (
                <form onSubmit={handleSave} className="mb-6 p-6 bg-background-50 border border-background-200 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Slug</label>
                            <input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" placeholder="uylen-toy" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Атауы ( қаз.)</label>
                            <input required value={form.title_kk} onChange={e => setForm({...form, title_kk: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground-700 mb-1">Сурет URL</label>
                            <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-white focus:outline-none focus:border-accent-400 text-sm" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={saving}
                            className="px-6 py-2.5 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors disabled:opacity-60">
                            {saving ? 'Сақталуда...' : 'Сақтау'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="px-6 py-2.5 rounded-xl bg-background-200 text-foreground-700 text-sm font-medium hover:bg-background-300 transition-colors">
                            Болдырмау
                        </button>
                    </div>
                </form>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-4 bg-background-50 border border-background-200 rounded-xl">
                        {c.image_url && <img src={c.image_url} alt={c.title_kk} className="w-12 h-12 rounded-lg object-cover" />}
                        <div>
                            <p className="font-medium text-foreground-900 text-sm">{c.title_kk}</p>
                            <p className="text-xs text-foreground-500 font-mono">{c.slug}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
    useAuthGuard();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') ?? 'orders';

    const handleLogout = async () => {
        if (supabase) await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const tabComponents: Record<string, React.ReactNode> = {
        orders: <OrdersTab />,
        invitations: <InvitationsTab />,
        templates: <TemplatesTab />,
        categories: <CategoriesTab />,
    };

    return (
        <div className="min-h-screen bg-background-100">
            {/* Sidebar / Header */}
            <header className="bg-background-50 border-b border-background-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-xl font-bold text-accent-700 font-heading">Toyga.kz</Link>
                        <span className="text-foreground-400 text-sm">/ Админ</span>
                    </div>
                    <button onClick={handleLogout} className="text-sm text-foreground-600 hover:text-foreground-900 transition-colors">
                        Шығу →
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-1 mb-8 bg-background-50 p-1 rounded-xl border border-background-200 w-fit">
                    {TAB_LABELS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setSearchParams({ tab: key })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === key
                                    ? 'bg-accent-500 text-white shadow-sm'
                                    : 'text-foreground-600 hover:text-foreground-900'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="bg-background-50 rounded-2xl border border-background-200 p-6 md:p-8">
                    {tabComponents[activeTab] ?? <OrdersTab />}
                </div>
            </div>
        </div>
    );
}
