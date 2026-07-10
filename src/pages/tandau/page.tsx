import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { getCategories, getTemplates, type Category, type Template } from '@/lib/apiClient';
import { WHATSAPP_NUMBER, invitationCategories, photoTemplates } from '@/mocks/homeData';

function TemplateSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden border border-background-200 animate-pulse">
            <div className="w-full aspect-[4/5] bg-background-200" />
            <div className="p-4 space-y-3">
                <div className="h-5 bg-background-200 rounded w-3/4" />
                <div className="h-4 bg-background-200 rounded w-1/3" />
                <div className="h-10 bg-background-200 rounded-full" />
            </div>
        </div>
    );
}

// Convert API types to display format
function formatPrice(price: number, extraPrice: number) {
    return {
        display: price === 0 ? 'Тегін' : `${price} ₸`,
        extra: `+ ${extraPrice} ₸ жаңарту`,
    };
}

export default function Tandau() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    const activeCategory = searchParams.get('category') ?? '';

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => {
                // Fallback to mocks if API not available
                setCategories(invitationCategories.map(c => ({
                    id: c.id,
                    slug: c.slug,
                    title_kk: c.title,
                    image_url: c.image,
                    sort_order: c.sort_order,
                })));
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        getTemplates(activeCategory || undefined)
            .then(setTemplates)
            .catch(() => {
                // Fallback to mocks
                const filtered = activeCategory
                    ? photoTemplates.filter(t => t.category_slug === activeCategory)
                    : photoTemplates;
                setTemplates(filtered.map(t => ({
                    id: t.id,
                    category_id: 0,
                    title: t.title,
                    description: t.description,
                    price: t.price === 'Тегін' ? 0 : parseInt(t.price),
                    extra_price: 400,
                    preview_image_url: t.preview_image_url,
                    is_free: t.is_free,
                    is_active: true,
                    sort_order: 0,
                })));
            })
            .finally(() => setLoading(false));
    }, [activeCategory]);

    const handleCategoryClick = (slug: string) => {
        if (slug === activeCategory) setSearchParams({});
        else setSearchParams({ category: slug });
    };

    const whatsappText = (title: string) =>
        `Сәлеметсіз бе! "${title}" үлгісіне тапсырыс бергім келеді.`;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {/* Header */}
                <section className="w-full bg-background-100 py-10 md:py-14 border-b border-background-200">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 md:w-20 bg-accent-300" />
                            <span className="text-sm font-medium text-accent-600 uppercase tracking-wider font-label">
                                Шақыру үлгілері
                            </span>
                            <div className="h-px w-12 md:w-20 bg-accent-300" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground-900 font-heading mb-4">
                            Той шақырулары каталогы
                        </h1>
                        <p className="text-foreground-600 max-w-xl mx-auto text-base md:text-lg">
                            500-ден астам үлгі ішінен тойыңызға ең керемет шақыруды таңдаңыз
                        </p>
                    </div>
                </section>

                {/* Category pills — sticky */}
                <section className="w-full bg-background-50/95 backdrop-blur-sm py-4 border-b border-background-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            <button
                                onClick={() => setSearchParams({})}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                    !activeCategory ? 'bg-accent-500 text-white shadow-sm' : 'bg-background-100 text-foreground-700 hover:bg-background-200'
                                }`}
                            >
                                Барлығы
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                        activeCategory === cat.slug ? 'bg-accent-500 text-white shadow-sm' : 'bg-background-100 text-foreground-700 hover:bg-background-200'
                                    }`}
                                >
                                    {cat.title_kk}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Templates grid */}
                <section className="w-full py-10 md:py-14">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => <TemplateSkeleton key={i} />)}
                            </div>
                        ) : templates.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-foreground-500 text-lg">Бұл санатта үлгілер жоқ</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {templates.map((template) => {
                                    const { display, extra } = formatPrice(template.price, template.extra_price);
                                    return (
                                        <SpotlightCard
                                            key={template.id}
                                            className="flex flex-col border border-background-200/70 hover:border-accent-300/60 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="relative w-full aspect-[4/5] overflow-hidden bg-background-100 rounded-t-xl">
                                                <img
                                                    src={template.preview_image_url}
                                                    alt={template.title}
                                                    width="400"
                                                    height="500"
                                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                {template.is_free && (
                                                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent-500 text-white text-xs font-semibold shadow">
                                                        Тегін
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3 p-4">
                                                <h3 className="text-base font-semibold text-foreground-900 font-heading leading-snug">
                                                    {template.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
                                                        {display}
                                                    </span>
                                                    <span className="text-xs text-foreground-500">{extra}</span>
                                                </div>
                                                <a
                                                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(whatsappText(template.title))}`}
                                                    rel="nofollow"
                                                    target="_blank"
                                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors mt-1"
                                                >
                                                    Тапсырыс беру
                                                </a>
                                            </div>
                                        </SpotlightCard>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}