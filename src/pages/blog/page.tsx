import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { blogArticles } from '@/core/constants/blogData';
export default function Blog() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <div className="w-full px-4 md:px-6 lg:px-8 py-12 md:py-16 max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground-900 font-heading mb-8 md:mb-12 text-center">
                        Той жаңалықтары
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {blogArticles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/blog/${article.slug}`}
                                className="group flex flex-col bg-background-50 rounded-xl overflow-hidden border border-background-200/70 hover:border-accent-300/60 transition-all duration-300 hover:shadow-lg"
                            >
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
                                <div className="flex flex-col gap-3 p-4 md:p-5 flex-1">
                                    <h2 className="text-base md:text-lg font-semibold text-foreground-900 font-heading leading-snug group-hover:text-accent-600 transition-colors">
                                        {article.title}
                                    </h2>
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
                </div>
            </main>
            <Footer />
        </div>
    );
}