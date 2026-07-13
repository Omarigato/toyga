import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '@/mocks/homeData';

const formatPhone = (p: string) => `+${p[0]} ${p.slice(1, 4)} ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9, 11)}`; const footerLinks = [
    { label: 'Той жайлы', href: '/blog' },
    { label: 'Шақыру үлгілері', href: '/tandau' },
    { label: 'Сурет шақырулар', href: '/suret' },
    { label: 'Той әндері', href: '/musics' },
];

export default function Footer() {
    return (
        <footer className="w-full bg-foreground-950 text-background-50 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-10 border-b border-foreground-800">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center border border-accent-100 overflow-hidden p-0.5">
                                <img src="/logo.png" alt="Toyga logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-lg font-bold font-heading">Toyga</span>
                        </div>
                        <p className="text-background-400 text-sm leading-relaxed max-w-xs">
                            Тойыңызға арналған керемет онлайн шақырулар. Тез, оңай және сапалы.
                        </p>
                        <a
                            href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="nofollow"
                            className="inline-flex items-center gap-2 mt-4 text-sm text-accent-400 hover:text-accent-300 transition-colors"
                        >
                            {formatPhone(WHATSAPP_NUMBER)}
                        </a>
                        <div className="flex items-center gap-3 mt-6">
                            <a
                                href="https://instagram.com/toygakz"
                                target="_blank"
                                rel="nofollow"
                                className="w-8 h-8 rounded-full bg-background-800 flex items-center justify-center text-background-400 hover:text-accent-400 hover:bg-background-700 transition-colors"
                            >
                                <i className="ri-instagram-line" />
                            </a>
                            <a
                                href="https://tiktok.com/@toyga.kz"
                                target="_blank"
                                rel="nofollow"
                                className="w-8 h-8 rounded-full bg-background-800 flex items-center justify-center text-background-400 hover:text-accent-400 hover:bg-background-700 transition-colors"
                            >
                                <i className="ri-tiktok-line" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-background-400 mb-4">Беттер</h3>
                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm text-background-300 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-background-400 mb-4">Тапсырыс беру</h3>
                        <p className="text-sm text-background-400 mb-4">
                            WhatsApp арқылы тапсырыс беріңіз — 5 минутта дайын!
                        </p>
                        <a
                            href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=%D0%A1%D3%99%D0%BB%D0%B5%D0%BC%D0%B5%D1%82%D1%81%D1%96%D0%B7%20%D0%B1%D0%B5!`}
                            target="_blank"
                            rel="nofollow"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors"
                        >
                            WhatsApp-та жазыңыз
                        </a>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-background-500 text-xs">
                        © {new Date().getFullYear()} Toyga — Барлық құқықтар қорғалған.
                    </p>
                </div>
            </div>
        </footer>
    );
}