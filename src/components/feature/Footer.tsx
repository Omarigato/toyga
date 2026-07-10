import { Link } from 'react-router-dom';

const footerLinks = [
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
                            <div className="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold font-heading">Toyga.kz</span>
                        </div>
                        <p className="text-background-400 text-sm leading-relaxed max-w-xs">
                            Тойыңызға арналған керемет онлайн шақырулар. Тез, оңай және сапалы.
                        </p>
                        <a
                            href="https://api.whatsapp.com/send?phone=77066403655"
                            target="_blank"
                            rel="nofollow"
                            className="inline-flex items-center gap-2 mt-4 text-sm text-accent-400 hover:text-accent-300 transition-colors"
                        >
                            +7 706 640-36-55
                        </a>
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
                            href="https://api.whatsapp.com/send?phone=77066403655&text=%D0%A1%D3%99%D0%BB%D0%B5%D0%BC%D0%B5%D1%82%D1%81%D1%96%D0%B7%20%D0%B1%D0%B5!"
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
                        © {new Date().getFullYear()} Toyga.kz — Барлық құқықтар қорғалған.
                    </p>
                    <Link to="/admin" className="text-background-600 hover:text-background-400 text-xs transition-colors">
                        Админ
                    </Link>
                </div>
            </div>
        </footer>
    );
}