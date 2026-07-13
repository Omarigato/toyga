import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { blogArticles } from '@/core/constants/blogData';
export default function BlogDetail() {
    const { slug } = useParams<{ slug: string }>();
    const article = blogArticles.find((a) => a.slug === slug);
    if (!article) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center px-4">
                        <h1 className="text-2xl font-bold text-foreground-900 font-heading mb-4">
                            Мақала табылмады
                        </h1>
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-background-50 font-medium hover:bg-primary-600 transition-colors"
                        >
                            Жаңалықтарға оралу
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <article className="w-full px-4 md:px-6 lg:px-8 py-10 md:py-16 max-w-3xl mx-auto">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm text-foreground-600 hover:text-accent-600 transition-colors mb-6"
                    >
                        <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-arrow-left-line" />
                        </div>
                        Жаңалықтарға оралу
                    </Link>
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-background-200">
                        <img
                            src={article.image}
                            alt={article.title}
                            width="800"
                            height="450"
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground-900 font-heading mb-4 leading-tight">
                        {article.title}
                    </h1>
                    <time className="text-sm text-foreground-500 block mb-8">
                        {article.date}
                    </time>
                    <div className="prose prose-lg max-w-none text-foreground-700 leading-relaxed">
                        <p className="text-lg mb-4">{article.excerpt}</p>
                        <p className="mb-4">
                            Бұл мақалада той шақырулары, дәстүрлі қазақ тойлары және отбасы құндылықтары туралы
                            толық ақпарат беріледі. Қазақ халқы ғасырлар бойы қалыптасқан дәстүрлерімен мақтанады.
                            Әрбір той – бұл береке мен бірліктің, отбасылық қуаныш пен сыйластықтың символы.
                        </p>
                        <p className="mb-4">
                            Той шақырулары біздің мәдениетімізде ерекше орын алады. Ол тек қонақтарды шақыру ғана емес,
                            сонымен қатар рухани дайындық пен құрмет білдірудің белгісі. Әрбір шақыру – бұл өнер туындысы,
                            ол той иелерінің дайындығын және қонақтарға деген құрметін бейнелейді.
                        </p>
                        <p>
                            Toyga (kel) қызметі арқылы сіз өзіңіздің тойыңызға арналған ерекше шақыруды оңай жасай аласыз.
                            Біздің дизайнерлік шешімдеріміз қазақ дәстүрлерінің рухын сақтай отырып, заманауи стильді
                            ұсынады. Тойыңыз есте қаларлықтай болсын!
                        </p>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}