import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { getCategories, getTemplates, type Category, type Template } from '@/lib/apiClient';
import { WHATSAPP_NUMBER } from '@/core/constants';
import { Skeleton } from '@/components/ui/Skeleton';
import { MessageCircle } from 'lucide-react';

function TemplateSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden border border-background-200 animate-pulse bg-background-50 p-4">
            <Skeleton className="w-full aspect-[4/5] rounded-lg" />
            <div className="mt-4 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded-full" />
            </div>
        </div>
    );
}

export default function Shablondar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    const activeCategory = searchParams.get('category') ?? '';

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch((err) => console.error('Error fetching categories:', err));
    }, []);

    useEffect(() => {
        setLoading(true);
        getTemplates(activeCategory || undefined)
            .then(setTemplates)
            .catch((err) => console.error('Error fetching templates:', err))
            .finally(() => setLoading(false));
    }, [activeCategory]);

    const handleCategoryClick = (slug: string) => {
        if (slug === activeCategory) setSearchParams({});
        else setSearchParams({ category: slug });
    };

    const whatsappText = (title: string) =>
        `Сәлеметсіз бе! "${title}" үлгісіне тапсырыс бергім келеді.`;

    return (
        <div className="flex flex-col min-h-screen bg-background-50">
            <Navbar />
            <main className="flex-1">
                {/* Header */}
                <section className="w-full bg-gradient-to-br from-[#1c070c] via-[#0d0c0d] to-[#120005] py-14 md:py-20 border-b border-primary-950/40 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,185,116,0.05),transparent_60%)] pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 md:w-20 bg-accent-300/40" />
                            <span className="text-sm font-semibold text-accent-400 uppercase tracking-widest font-label">
                                Шақыру үлгілері
                            </span>
                            <div className="h-px w-12 md:w-20 bg-accent-300/40" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-accent-500 font-heading mb-4 tracking-tight drop-shadow-sm">
                            Той шақырулары каталогы
                        </h1>
                        <p className="text-foreground-300 max-w-xl mx-auto text-base md:text-lg">
                            Сіздің ерекше мерекеңізге арналған заманауи және интерактивті шақырулар
                        </p>
                    </div>
                </section>

                {/* Category filters */}
                <section className="w-full bg-background-50/95 backdrop-blur-sm py-5 border-b border-background-200/80 sticky top-16 z-20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
                            <button
                                onClick={() => setSearchParams({})}
                                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                                    !activeCategory 
                                        ? 'bg-accent-500 text-foreground-950 shadow-md shadow-accent-500/10' 
                                        : 'bg-background-100 text-foreground-700 hover:bg-background-200 hover:text-foreground-900'
                                }`}
                            >
                                Барлығы
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                                        activeCategory === cat.slug 
                                            ? 'bg-accent-500 text-foreground-950 shadow-md shadow-accent-500/10' 
                                            : 'bg-background-100 text-foreground-700 hover:bg-background-200 hover:text-foreground-900'
                                    }`}
                                >
                                    {cat.title_kk}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Templates grid */}
                <section className="w-full py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {Array.from({ length: 8 }).map((_, i) => <TemplateSkeleton key={i} />)}
                            </div>
                        ) : templates.length === 0 ? (
                            <div className="text-center py-24 bg-background-100 rounded-2xl border border-dashed border-background-300">
                                <p className="text-foreground-500 text-lg font-medium">Бұл санатта әзірге үлгілер жоқ</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {templates.map((template) => {
                                    return (
                                        <SpotlightCard
                                            key={template.id}
                                            className="flex flex-col border border-background-200/80 hover:border-accent-300/50 hover:shadow-2xl transition-all duration-500 bg-background-50 overflow-hidden group"
                                        >
                                            {/* Preview image with hover zoom */}
                                            <div className="relative w-full aspect-[4/5] overflow-hidden bg-background-100">
                                                {template.preview_image_url ? (
                                                    <img
                                                        src={template.preview_image_url}
                                                        alt={template.title}
                                                        width="400"
                                                        height="500"
                                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-background-200" />
                                                )}
                                                {template.is_free && (
                                                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-accent-500 text-foreground-950 text-xs font-bold shadow-md">
                                                        Тегін
                                                    </span>
                                                )}
                                            </div>
                                            {/* Content details */}
                                            <div className="flex flex-col gap-3 p-5 flex-1 justify-between">
                                                <div className="space-y-2">
                                                    <h3 className="text-base font-bold text-foreground-900 font-heading leading-snug group-hover:text-primary-600 transition-colors duration-300">
                                                        {template.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-bold">
                                                            {template.price === 0 ? 'Тегін' : `${template.price} ₸`}
                                                        </span>
                                                        <span className="text-[11px] text-foreground-500 font-medium">
                                                            + 400 ₸ жаңарту
                                                        </span>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(whatsappText(template.title))}`}
                                                    rel="nofollow"
                                                    target="_blank"
                                                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-foreground-950 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/10 mt-4 group-hover:-translate-y-0.5"
                                                >
                                                    <MessageCircle className="w-4 h-4 text-foreground-950" />
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