import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { getCategories, getTemplates } from '@/lib/api';
import type { Category, Template } from '@/mocks/homeData';
import { WHATSAPP_NUMBER } from '@/mocks/homeData';

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

export default function Tandau() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    const activeCategory = searchParams.get('category') ?? '';

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    useEffect(() => {
        setLoading(true);
        getTemplates(activeCategory || undefined).then((data) => {
            setTemplates(data);
            setLoading(false);
        });
    }, [activeCategory]);

    const handleCategoryClick = (slug: string) => {
        if (slug === activeCategory) {
            setSearchParams({});
        } else {
            setSearchParams({ category: slug });
        }
    };

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

                {/* Category filter pills */}
                <section className="w-full bg-background-50 py-5 border-b border-background-200 sticky top-0 z-10 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <button
                                onClick={() => setSearchParams({})}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                    !activeCategory
                                        ? 'bg-accent-500 text-white shadow-sm'
                                        : 'bg-background-100 text-foreground-700 hover:bg-background-200'
                                }`}
                            >
                                Барлығы
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                        activeCategory === cat.slug
                                            ? 'bg-accent-500 text-white shadow-sm'
                                            : 'bg-background-100 text-foreground-700 hover:bg-background-200'
                                    }`}
                                >
                                    {cat.title}
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
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <TemplateSkeleton key={i} />
                                ))}
                            </div>
                        ) : templates.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-foreground-500 text-lg">Бұл санатта үлгілер жоқ</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {templates.map((template) => (
                                    <SpotlightCard
                                        key={template.id}
                                        className="flex flex-col border border-background-200/70 hover:border-accent-300/60 hover:shadow-xl transition-all duration-300"
                                    >
                                        {/* Image */}
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
                                        {/* Content */}
                                        <div className="flex flex-col gap-3 p-4">
                                            <h3 className="text-base font-semibold text-foreground-900 font-heading leading-snug">
                                                {template.title}
                                            </h3>
                                            <p className="text-xs text-foreground-500 line-clamp-2">
                                                {template.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
                                                    {template.price}
                                                </span>
                                                <span className="text-xs text-foreground-500">
                                                    {template.extra_price}
                                                </span>
                                            </div>
                                            <a
                                                href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(template.whatsapp_text)}`}
                                                rel="nofollow"
                                                target="_blank"
                                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors mt-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                </svg>
                                                Тапсырыс беру
                                            </a>
                                        </div>
                                    </SpotlightCard>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}