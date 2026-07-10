import { Link } from 'react-router-dom';
export default function Footer() {
    return (
        <footer className="w-full bg-foreground-900 text-background-100">
            {/* Footer top */}
            <div className="w-full px-4 md:px-6 lg:px-8 py-10 md:py-12 border-b border-foreground-700/40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start">
                    {/* Logo */}
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-accent-500 flex items-center justify-center">
                                <i className="ri-mail-send-line text-background-50 text-lg" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-bold text-background-50 font-heading tracking-tight">shaqyru</span>
                                <span className="text-[10px] text-background-300 uppercase tracking-wider font-label">онлайн конструктор</span>
                            </div>
                        </Link>
                    </div>
                    {/* Address */}
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">
                            <i className="ri-map-pin-line text-accent-400" />
                        </div>
                        <span className="text-sm text-background-200">Қазақстан бойынша</span>
                    </div>
                    {/* Phone */}
                    <div>
                        <a
                            href="tel:+77066403655"
                            rel="nofollow"
                            className="flex items-center gap-3 text-sm text-background-200 hover:text-accent-400 transition-colors"
                        >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                <i className="ri-phone-line text-accent-400" />
                            </div>
                            +7 706 640-36-55
                        </a>
                    </div>
                </div>
            </div>
            {/* Footer bottom */}
            <div className="w-full px-4 md:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-background-400 text-center sm:text-left">
                        &copy;2026. Барлық құқықтар қорғалған
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/shaqyru.kz_"
                            rel="nofollow"
                            target="_blank"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground-800 hover:bg-accent-500 transition-colors"
                            aria-label="Instagram"
                        >
                            <i className="ri-instagram-line text-background-200" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@shaqyru.kz"
                            rel="nofollow"
                            target="_blank"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground-800 hover:bg-accent-500 transition-colors"
                            aria-label="TikTok"
                        >
                            <i className="ri-tiktok-line text-background-200" />
                        </a>
                        <a
                            href="https://t.me/shaqyrukz_bot"
                            rel="nofollow"
                            target="_blank"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground-800 hover:bg-accent-500 transition-colors"
                            aria-label="Telegram"
                        >
                            <i className="ri-telegram-line text-background-200" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}