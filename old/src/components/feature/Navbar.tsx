import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '@/mocks/homeData';

const formatPhone = (p: string) => `+${p[0]} ${p.slice(1, 4)} ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9, 11)}`;

const navLinks = [
    { label: 'Той жайлы', href: '/blog' },
    { label: 'Әндер', href: '/musics' },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <header className="w-full bg-background-50/90 backdrop-blur-sm border-b border-background-200/60">
            <div className="w-full px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center border border-accent-100 overflow-hidden p-1">
                            <img src="/logo.png" alt="Toyga logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-bold text-accent-700 font-heading tracking-tight">Toyga</span>
                        </div>
                    </Link>
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="text-sm font-medium text-foreground-700 hover:text-accent-600 transition-colors whitespace-nowrap"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href={`tel:+${WHATSAPP_NUMBER}`}
                            rel="nofollow"
                            className="flex items-center gap-2 text-sm font-medium text-foreground-700 hover:text-accent-600 transition-colors whitespace-nowrap mr-2"
                        >
                            <div className="w-5 h-5 flex items-center justify-center">
                                <i className="ri-phone-line text-accent-600" />
                            </div>
                            {formatPhone(WHATSAPP_NUMBER)}
                        </a>
                        <a
                            href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=%D0%A1%D3%99%D0%BB%D0%B5%D0%BC%D0%B5%D1%82%D1%81%D1%96%D0%B7%20%D0%B1%D0%B5!`}
                            rel="nofollow"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 text-background-50 text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap"
                        >
                            <div className="w-4 h-4 flex items-center justify-center">
                                <i className="ri-whatsapp-line" />
                            </div>
                            Сұрақ қою
                        </a>
                        <a
                            href="https://instagram.com/toygakz"
                            target="_blank"
                            rel="nofollow"
                            className="w-9 h-9 flex items-center justify-center rounded-md bg-background-100 text-foreground-700 hover:text-accent-600 hover:bg-background-200 transition-colors"
                        >
                            <i className="ri-instagram-line text-lg" />
                        </a>
                        <a
                            href="https://tiktok.com/@toyga.kz"
                            target="_blank"
                            rel="nofollow"
                            className="w-9 h-9 flex items-center justify-center rounded-md bg-background-100 text-foreground-700 hover:text-accent-600 hover:bg-background-200 transition-colors"
                        >
                            <i className="ri-tiktok-line text-lg" />
                        </a>
                    </div>
                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden w-10 h-10 flex items-center justify-center text-foreground-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Меню"
                    >
                        <div className="w-6 h-6 flex items-center justify-center">
                            {mobileMenuOpen ? (
                                <i className="ri-close-line text-xl" />
                            ) : (
                                <i className="ri-menu-line text-xl" />
                            )}
                        </div>
                    </button>
                </div>
            </div>
            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-background-200/60 bg-background-50 px-4 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className="block text-base font-medium text-foreground-700 hover:text-accent-600 transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <hr className="border-background-200/60" />
                    <a
                        href={`tel:+${WHATSAPP_NUMBER}`}
                        rel="nofollow"
                        className="flex items-center gap-2 text-base font-medium text-foreground-700 py-2"
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-phone-line text-accent-600" />
                        </div>
                        {formatPhone(WHATSAPP_NUMBER)}
                    </a>
                    <a
                        href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=%D0%A1%D3%99%D0%BB%D0%B5%D0%BC%D0%B5%D1%82%D1%81%D1%96%D0%B7%20%D0%B1%D0%B5!`}
                        rel="nofollow"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 text-background-50 text-base font-medium w-full justify-center"
                    >
                        <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-whatsapp-line" />
                        </div>
                        Сұрақ қою
                    </a>
                    <div className="flex items-center gap-4 pt-2 justify-center">
                        <a
                            href="https://instagram.com/toygakz"
                            target="_blank"
                            rel="nofollow"
                            className="w-10 h-10 flex items-center justify-center rounded-md bg-background-100 text-foreground-700 hover:text-accent-600 hover:bg-background-200 transition-colors"
                        >
                            <i className="ri-instagram-line text-xl" />
                        </a>
                        <a
                            href="https://tiktok.com/@toyga.kz"
                            target="_blank"
                            rel="nofollow"
                            className="w-10 h-10 flex items-center justify-center rounded-md bg-background-100 text-foreground-700 hover:text-accent-600 hover:bg-background-200 transition-colors"
                        >
                            <i className="ri-tiktok-line text-xl" />
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}