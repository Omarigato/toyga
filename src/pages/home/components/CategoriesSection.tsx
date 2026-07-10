import { Link } from 'react-router-dom';
import { invitationCategories } from '@/mocks/homeData';
export default function CategoriesSection() {
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
                    {invitationCategories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/tandau?category=${category.slug}`}
                            className="group relative overflow-hidden rounded-xl aspect-[3/1] md:aspect-[3.5/1] block"
                        >
                            {/* Background image */}
                            <img
                                src={category.image}
                                alt={category.title}
                                width="600"
                                height="200"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
                            {/* Text */}
                            <div className="absolute inset-0 flex items-center justify-end pr-6 md:pr-8">
                                <span className="text-lg md:text-xl font-bold text-white font-heading drop-shadow-lg">
                                    {category.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}