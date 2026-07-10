import { Link } from 'react-router-dom';
export default function HeroSection() {
    return (
        <section className="w-full bg-background-50">
            <div className="w-full px-4 md:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
                    {/* Text content */}
                    <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col items-start gap-5 md:gap-6">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-accent-600 font-heading">
                            Тойыңызға
                            <br />
                            <span className="text-accent-500">арналған шақыруды</span>
                        </h1>
                        <p className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground-700 font-heading">
                            — 5 минутта жасап береміз!
                        </p>
                        <p className="text-base md:text-lg text-foreground-600 max-w-lg leading-relaxed">
                            Шақырудың 500-ге жуық тегін және ақылы үлгілерін ұсынамыз
                        </p>
                        <Link
                            to="/tandau"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-500 text-background-50 text-base font-semibold hover:bg-primary-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap mt-2"
                        >
                            <span className="text-lg">🚀</span>
                            Тойға шақыру жасау
                        </Link>
                    </div>
                    {/* Phone image */}
                    <div className="w-full md:w-[45%] lg:w-[50%] flex justify-center md:justify-end">
                        <div className="relative w-[280px] sm:w-[360px] md:w-[400px] lg:w-[460px]">
                            <img
                                src="https://readdy.ai/api/search-image?query=Modern smartphone mockup displaying an elegant Kazakh digital wedding invitation card with golden traditional ornaments and floral borders on screen, floating at angle with soft shadows, clean white studio background, premium product photography style&width=518&height=608&seq=hero-phone-01&orientation=portrait"
                                alt="Shaqyru.kz мобильді қосымшасы"
                                width="518"
                                height="608"
                                className="w-full h-auto object-contain"
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}