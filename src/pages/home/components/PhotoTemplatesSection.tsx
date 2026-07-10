import { Link } from 'react-router-dom';
import { photoTemplates, whatsappNumber } from '@/mocks/homeData';
export default function PhotoTemplatesSection() {
    return (
        <section className="w-full bg-background-50 py-12 md:py-16 lg:py-20">
            <div className="w-full px-4 md:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-px w-12 md:w-20 bg-accent-300" />
                        <span className="text-sm font-medium text-accent-600 uppercase tracking-wider font-label">
                            Фото шақырулар
                        </span>
                        <div className="h-px w-12 md:w-20 bg-accent-300" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground-900 font-heading">
                        Сурет шақыру үлгілері
                    </h2>
                </div>
                {/* Templates grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {photoTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="group flex flex-col bg-background-50 rounded-xl overflow-hidden border border-background-200/70 hover:border-accent-300/60 transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Image */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden bg-background-100">
                                <img
                                    src={template.image}
                                    alt={template.title}
                                    width="400"
                                    height="500"
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            {/* Content */}
                            <div className="flex flex-col gap-3 p-4 md:p-5">
                                <h3 className="text-base md:text-lg font-semibold text-foreground-900 font-heading leading-snug">
                                    {template.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
                                        {template.price}
                                    </span>
                                    <span className="text-xs text-foreground-600">
                                        {template.extraPrice}
                                    </span>
                                </div>
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(template.whatsappText)}`}
                                    rel="nofollow"
                                    target="_blank"
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-secondary-500 text-background-50 text-sm font-semibold hover:bg-secondary-600 transition-colors whitespace-nowrap mt-1"
                                >
                                    Тапсырыс беру
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                {/* View all button */}
                <div className="flex justify-center mt-10 md:mt-12">
                    <Link
                        to="/suret"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-500 text-background-50 text-base font-semibold hover:bg-primary-600 transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                    >
                        <span className="text-lg">🎉</span>
                        Барлық үлгілерді көру
                    </Link>
                </div>
            </div>
        </section>
    );
}