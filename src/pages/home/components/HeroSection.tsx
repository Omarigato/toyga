import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="w-full bg-gradient-to-br from-[#1b060b] via-[#0d0c0d] to-[#140206] py-16 md:py-24 lg:py-32 relative overflow-hidden border-b border-primary-950/40">
            {/* Visual background highlight circles */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-500/5 blur-[120px] pointer-events-none" />

            <div className="w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-24">
                    {/* Text content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full md:w-[55%] flex flex-col items-start gap-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-950/60 border border-primary-800/40 text-accent-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-pulse" />
                            <span>Жаңа буын шақырулары</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-accent-500 font-heading tracking-tight drop-shadow-md">
                            Тойыңызға
                            <br />
                            <span className="text-white bg-clip-text">арналған шақыруды</span>
                        </h1>

                        <p className="text-xl md:text-2xl lg:text-3xl font-medium text-accent-200/90 font-heading">
                            — 5 минутта жасап береміз!
                        </p>

                        <p className="text-base md:text-lg text-foreground-300 max-w-lg leading-relaxed">
                            Шақырудың 500-ге жуық тегін және ақылы үлгілерін ұсынамыз. Өз қалауыңызша жасап, қонақтарыңызды таң қалдырыңыз.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-4">
                            <Link
                                to="/shablondar"
                                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-accent-500 text-foreground-950 text-base font-semibold hover:bg-accent-400 transition-all duration-300 shadow-[0_4px_20px_rgba(224,185,116,0.15)] hover:shadow-[0_4px_30px_rgba(224,185,116,0.3)] hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                Тойға шақыру жасау
                                <ArrowRight className="w-5 h-5 text-foreground-950" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Phone image mockup with motion */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50, rotate: 2 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="w-full md:w-[45%] flex justify-center md:justify-end"
                    >
                        <div className="relative w-[280px] sm:w-[360px] md:w-[380px] lg:w-[420px] group">
                            {/* Glassmorphic border glow behind mockup */}
                            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-primary-500/20 to-accent-500/20 blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <img
                                src="https://readdy.ai/api/search-image?query=Modern smartphone mockup displaying an elegant Kazakh digital wedding invitation card with golden traditional ornaments and floral borders on screen, floating at angle with soft shadows, clean white studio background, premium product photography style&width=518&height=608&seq=hero-phone-01&orientation=portrait"
                                alt="Toyga мобильді қосымшасы"
                                width="518"
                                height="608"
                                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.02]"
                                loading="eager"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}