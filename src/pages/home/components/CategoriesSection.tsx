import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, Category } from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CategoriesSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching categories:', err);
                setLoading(false);
            });
    }, []);

    return (
        <section className="w-full bg-background-100 py-12 md:py-16 lg:py-20">
            <div className="w-full px-4 md:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-px w-12 md:w-20 bg-accent-300" />
                        <span className="text-sm font-medium text-accent-600 uppercase tracking-wider font-label">
                            Той шақырулары
                        </span>
                        <div className="h-px w-12 md:w-20 bg-accent-300" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground-900 font-heading">
                        Сайт шақыру үлгілері
                    </h2>
                </div>
                
                {/* Categories grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="aspect-[3/1] md:aspect-[3.5/1] w-full rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/shablondar?category=${category.slug}`}
                                className="group relative overflow-hidden rounded-xl aspect-[3/1] md:aspect-[3.5/1] block border border-background-200"
                            >
                                {/* Background image */}
                                {category.image_url ? (
                                    <img
                                        src={category.image_url}
                                        alt={category.title_kk}
                                        width="600"
                                        height="200"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-background-200" />
                                )}
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                                {/* Text */}
                                <div className="absolute inset-0 flex items-center justify-start pl-6 md:pl-8">
                                    <span className="text-lg md:text-xl font-bold text-white font-heading drop-shadow-md">
                                        {category.title_kk}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}