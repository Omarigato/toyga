import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInvitation, getInvitationGuests, submitGuest, type DBInvitation, type DBGuest } from '@/lib/api';

// ── Countdown ─────────────────────────────────────────────────────────────────
function Countdown({ eventDate }: { eventDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calc = () => {
            const diff = new Date(eventDate).getTime() - Date.now();
            if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [eventDate]);

    const units = [
        { label: 'Күн', value: timeLeft.days },
        { label: 'Сағат', value: timeLeft.hours },
        { label: 'Минут', value: timeLeft.minutes },
        { label: 'Секунд', value: timeLeft.seconds },
    ];

    return (
        <div className="flex gap-3 sm:gap-6 justify-center">
            {units.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl font-bold text-white font-heading">
                            {String(value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-white/70 text-xs mt-2 uppercase tracking-wider">{label}</span>
                </div>
            ))}
        </div>
    );
}

// ── RSVP Form ─────────────────────────────────────────────────────────────────
function RSVPForm({ invitationId }: { invitationId: number }) {
    const [form, setForm] = useState({ name: '', rsvp_status: 'yes', guest_count: 1, message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const ok = await submitGuest({
            invitation_id: invitationId,
            name: form.name,
            rsvp_status: form.rsvp_status as 'yes' | 'no' | 'maybe',
            guest_count: form.guest_count,
            message: form.message || undefined,
        });
        setLoading(false);
        if (ok) setSuccess(true);
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-foreground-900 font-heading mb-2">Рахмет!</h3>
                <p className="text-foreground-600">Сіздің жауабыңыз қабылданды.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5">Атыңыз</label>
                <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                    placeholder="Есіміңізді енгізіңіз"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5">Қатысасыз ба?</label>
                <div className="flex gap-2">
                    {[['yes', '✅ Иә'], ['no', '❌ Жоқ'], ['maybe', '🤔 Мүмкін']].map(([val, label]) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setForm({ ...form, rsvp_status: val })}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                form.rsvp_status === val
                                    ? 'bg-accent-500 text-white'
                                    : 'bg-background-100 text-foreground-700 hover:bg-background-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5">Қонақтар саны</label>
                <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.guest_count}
                    onChange={(e) => setForm({ ...form, guest_count: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5">Тілек (міндетті емес)</label>
                <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors resize-none"
                    placeholder="Той иелеріне тілегіңізді жазыңыз..."
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors disabled:opacity-60"
            >
                {loading ? 'Жіберілуде...' : 'Жауап жіберу'}
            </button>
        </form>
    );
}

// ── Guest Wishes ───────────────────────────────────────────────────────────────
function GuestWishes({ guests }: { guests: DBGuest[] }) {
    const withMessages = guests.filter((g) => g.message);
    if (withMessages.length === 0) return null;

    const col1 = withMessages.filter((_, i) => i % 2 === 0);
    const col2 = withMessages.filter((_, i) => i % 2 === 1);

    const WishCard = ({ guest }: { guest: DBGuest }) => (
        <div className="bg-background-50 border border-background-200 rounded-xl p-4 mb-4">
            <p className="text-foreground-700 text-sm leading-relaxed italic mb-3">"{guest.message}"</p>
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 text-xs font-bold">
                    {guest.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground-800">{guest.name}</span>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
            <div>{col1.map((g) => <WishCard key={g.id} guest={g} />)}</div>
            <div>{col2.map((g) => <WishCard key={g.id} guest={g} />)}</div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InvitationPage() {
    const { slug } = useParams<{ slug: string }>();
    const [invitation, setInvitation] = useState<DBInvitation | null>(null);
    const [guests, setGuests] = useState<DBGuest[]>([]);
    const [loading, setLoading] = useState(true);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const audioRef = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!slug) return;
        Promise.all([getInvitation(slug), getInvitationGuests(0)]).then(([inv]) => {
            setInvitation(inv);
            if (inv) getInvitationGuests(inv.id).then(setGuests);
            setLoading(false);
        });
    }, [slug]);

    useEffect(() => {
        if (!invitation) return;
        document.title = `${invitation.owner_name} — ${invitation.event_type} | Toyga.kz`;
        // OG tags
        const setMeta = (name: string, content: string) => {
            let el = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute('property', name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };
        setMeta('og:title', `${invitation.owner_name} — ${invitation.event_type}`);
        setMeta('og:description', invitation.custom_data?.description ?? 'Той шақыруы');
        if (invitation.cover_image_url) setMeta('og:image', invitation.cover_image_url);
    }, [invitation]);

    const toggleAudio = () => {
        const audio = audioRef[0] as HTMLAudioElement | null;
        if (!audio) return;
        if (audioPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setAudioPlaying(!audioPlaying);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-50">
                <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!invitation) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background-50 text-center px-4">
                <h1 className="text-3xl font-bold font-heading text-foreground-900 mb-4">Шақыру табылмады</h1>
                <p className="text-foreground-600 mb-8">Сілтеме дұрыс емес немесе шақыру жойылған.</p>
                <Link to="/" className="px-6 py-3 rounded-full bg-accent-500 text-white font-medium hover:bg-accent-600 transition-colors">
                    Басты бетке
                </Link>
            </div>
        );
    }

    const eventDateFormatted = new Date(invitation.event_date).toLocaleDateString('kk-KZ', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    const eventTimeFormatted = new Date(invitation.event_date).toLocaleTimeString('kk-KZ', {
        hour: '2-digit', minute: '2-digit',
    });

    const cd = invitation.custom_data ?? {};

    return (
        <div className="min-h-screen bg-background-100 font-body">
            {/* ── 1. Cover ── */}
            <section
                className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden"
                style={{
                    background: invitation.cover_image_url
                        ? `url(${invitation.cover_image_url}) center/cover no-repeat`
                        : 'linear-gradient(135deg, oklch(0.4 0.16 145) 0%, oklch(0.3 0.12 80) 100%)',
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <p className="text-white/80 text-sm uppercase tracking-[0.3em] font-label">
                        {invitation.event_type}
                    </p>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white font-heading leading-tight">
                        {invitation.owner_name}
                    </h1>
                    <p className="text-white/90 text-xl sm:text-2xl font-heading">
                        {eventDateFormatted}
                    </p>
                    {cd.dressCode && (
                        <p className="text-white/70 text-sm">Dress code: {cd.dressCode}</p>
                    )}
                    <div className="pt-4">
                        <Countdown eventDate={invitation.event_date} />
                    </div>
                </div>
                {/* Scroll hint */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </section>

            {/* ── 2. Description ── */}
            {cd.description && (
                <section className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px w-12 bg-accent-300" />
                        <span className="text-accent-600 text-sm uppercase tracking-wider font-label">Шақыру</span>
                        <div className="h-px w-12 bg-accent-300" />
                    </div>
                    <p className="text-foreground-700 text-lg leading-relaxed">{cd.description}</p>
                </section>
            )}

            {/* ── 3. Details ── */}
            <section className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-background-50 rounded-2xl border border-background-200 p-6 sm:p-8 space-y-6">
                    <h2 className="text-2xl font-bold font-heading text-foreground-900 text-center">Той мәліметтері</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-foreground-500 uppercase tracking-wide mb-0.5">Күні</p>
                                <p className="text-foreground-900 font-semibold">{eventDateFormatted}</p>
                                <p className="text-foreground-600 text-sm">{eventTimeFormatted}</p>
                            </div>
                        </div>
                        {invitation.event_location && (
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-foreground-500 uppercase tracking-wide mb-0.5">Орны</p>
                                    <p className="text-foreground-900 font-semibold">{invitation.event_location}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── 4. Map ── */}
            {invitation.event_lat && invitation.event_lng && (
                <section className="max-w-2xl mx-auto px-4 pb-12">
                    <div className="rounded-2xl overflow-hidden border border-background-200 h-64">
                        <iframe
                            title="Той орны"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${invitation.event_lat},${invitation.event_lng}&z=15&output=embed`}
                        />
                    </div>
                </section>
            )}

            {/* ── 5. Audio ── */}
            {invitation.audio_url && (
                <section className="max-w-2xl mx-auto px-4 pb-12">
                    <div className="bg-background-50 rounded-2xl border border-background-200 p-6 flex items-center gap-4">
                        <button
                            onClick={toggleAudio}
                            className="w-14 h-14 rounded-full bg-accent-500 text-white flex items-center justify-center shrink-0 hover:bg-accent-600 transition-colors"
                        >
                            {audioPlaying ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                        <div>
                            <p className="font-semibold text-foreground-900">Той музыкасы</p>
                            <p className="text-sm text-foreground-500">Ойнату үшін басыңыз</p>
                        </div>
                        <audio
                            ref={(el) => { (audioRef as React.MutableRefObject<HTMLAudioElement | null>).current = el; }}
                            src={invitation.audio_url}
                            onEnded={() => setAudioPlaying(false)}
                        />
                    </div>
                </section>
            )}

            {/* ── 6. Guest Wishes ── */}
            {guests.filter(g => g.message).length > 0 && (
                <section className="max-w-2xl mx-auto px-4 pb-12">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-background-200" />
                        <h2 className="text-xl font-bold font-heading text-foreground-900">Тілектер</h2>
                        <div className="h-px flex-1 bg-background-200" />
                    </div>
                    <GuestWishes guests={guests} />
                </section>
            )}

            {/* ── 7. RSVP ── */}
            <section className="max-w-2xl mx-auto px-4 pb-20">
                <div className="bg-background-50 rounded-2xl border border-background-200 p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold font-heading text-foreground-900 mb-2">Жауап беріңіз</h2>
                        <p className="text-foreground-600">Тойға қатысасыз ба? Бізге хабарлаңыз!</p>
                    </div>
                    <RSVPForm invitationId={invitation.id} />
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-6 border-t border-background-200">
                <p className="text-foreground-500 text-sm">
                    Шақыру{' '}
                    <Link to="/" className="text-accent-600 hover:underline font-medium">
                        Toyga.kz
                    </Link>{' '}
                    арқылы жасалған
                </p>
            </footer>
        </div>
    );
}
