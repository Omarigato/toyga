import { Link } from 'react-router-dom';
import { blogArticles } from '@/core/constants/blogData';
export default function BlogPreviewSection() {
    return (
        <section className="w-full bg-background-100 py-12 md:py-16 lg:py-20">
            <div className="w-full px-4 md:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-px w-12 md:w-20 bg-accent-300" />
                        <span className="text-sm font-medium text-accent-600 uppercase tracking-wider font-label">
                            Жаңалықтар
                        </span>
                        <div className="h-px w-12 md:w-20 bg-accent-300" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground-900 font-heading">
                        Соңғы той жаңалықтары
                    </h2>
                </div>
                {/* Blog grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {blogArticles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/blog/${article.slug}`}
                            className="group flex flex-col bg-background-50 rounded-xl overflow-hidden border border-background-200/70 hover:border-accent-300/60 transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Image */}
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-background-200">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    width="400"
                                    height="300"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            {/* Content */}
                            <div className="flex flex-col gap-3 p-4 md:p-5 flex-1">
                                <h3 className="text-base md:text-lg font-semibold text-foreground-900 font-heading leading-snug group-hover:text-accent-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-foreground-600 leading-relaxed line-clamp-3 flex-1">
                                    {article.excerpt}
                                </p>
                                <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-secondary-500 text-background-50 text-sm font-medium hover:bg-secondary-600 transition-colors mt-auto">
                                    Толық оқу
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
                {/* View all button */}
                <div className="flex justify-center mt-10 md:mt-12">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-500 text-background-50 text-base font-semibold hover:bg-primary-600 transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                    >
                        Өзге жаңалықтар
                    </Link>
                </div>
            </div>
        </section>
    );
}