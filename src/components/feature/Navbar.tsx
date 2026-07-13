import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '@/core/constants';
import { Phone, MessageCircle, Instagram, Menu, X, Music } from 'lucide-react';
import { userGetMe } from '@/lib/apiClient';

const formatPhone = (p: string) => `+${p[0]} ${p.slice(1, 4)} ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9, 11)}`;

const navLinks = [
    { label: 'Той жайлы', href: '/blog' },
    { label: 'Шаблондар', href: '/shablondar' },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        userGetMe()
            .then((res) => {
                if (res && res.success) {
                    setIsLoggedIn(true);
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
            });
    }, []);
    return (
        <header className="w-full bg-background-50/90 backdrop-blur-sm border-b border-background-200/60 sticky top-0 z-40">
            <div className="w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center border border-accent-100 overflow-hidden p-1">
                            <span className="text-xl font-bold text-accent-600 font-heading">T</span>
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
                            <Phone className="w-4 h-4 text-accent-600" />
                            {formatPhone(WHATSAPP_NUMBER)}
                        </a>
                        <a
                            href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=%D0%A1%D3%99%D0%BB%D0%B5%D0%BC%D0%B5%D1%82%D1%81%D1%96%D0%B7%20%D0%B1%D0%B5!`}
                            rel="nofollow"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-primary-500 text-primary-750 hover:bg-primary-50 text-sm font-medium transition-colors whitespace-nowrap"
                        >
                            <MessageCircle className="w-4 h-4 text-primary-600" />
                            Сұрақ қою
                        </a>
                        {isLoggedIn ? (
                            <Link
                                to="/app/events"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent-500 text-foreground-950 text-sm font-semibold hover:bg-accent-400 transition-colors whitespace-nowrap shadow-sm"
                            >
                                Жеке кабинет
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 text-background-50 text-sm font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap shadow-sm"
                            >
                                Кіру / Тіркелу
                            </Link>
                        )}
                        <a
                            href="https://instagram.com/toygakz"
                            target="_blank"
                            rel="nofollow"
                            className="w-9 h-9 flex items-center justify-center rounded-md bg-background-100 text-foreground-700 hover:text-accent-600 hover:bg-background-200 transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://tiktok.com/@toyga.kz"
                            target="_blank"
                            rel="nofollow"
                            className="w-9 h-9 flex items-center justify-center rounded-md bg-background-100 text-foreground-700 hover:text-accent-600 hover:bg-background-200 transition-colors"
                            aria-label="TikTok"
                        >
                            <Music className="w-5 h-5" />
                        </a>
                    </div>
                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden w-10 h-10 flex items-center justify-center text-foreground-700 focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Меню"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
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
                        <Phone className="w-5 h-5 text-accent-600" />
                        {formatPhone(WHATSAPP_NUMBER)}
                    </a>
                    {isLoggedIn ? (
                        <Link
                            to="/app/events"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent-500 text-foreground-950 text-base font-semibold w-full justify-center shadow-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Жеке кабинет
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 text-background-50 text-base font-semibold w-full justify-center shadow-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Кіру / Тіркелу
                        </Link>
                    )}
                    <a
                        href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=%D0%A1%D3%99%D0%BB%D0%B5%D0%BC%D0%B5%D1%82%D1%81%D1%96%D0%B7%20%D0%B1%D0%B5!`}
                        rel="nofollow"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-primary-500 text-primary-750 text-base font-medium w-full justify-center"
                    >
                        <MessageCircle className="w-5 h-5 text-primary-600" />
                        Сұрақ қою
                    </a>
                    <div className="flex items-center gap-4 pt-2 justify-center">
                        <a
                            href="https://instagram.com/toygakz"
                            target="_blank"
                            rel="nofollow"
                            className="w-10 h-10 flex items-center justify-center rounded-md bg-background-100 text-foreground-700 hover:text-accent-600 hover:bg-background-200 transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://tiktok.com/@toyga.kz"
                            target="_blank"
                            rel="nofollow"
                            className="w-10 h-10 flex items-center justify-center rounded-md bg-background-100 text-foreground-700 hover:text-accent-600 hover:bg-background-200 transition-colors"
                            aria-label="TikTok"
                        >
                            <Music className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}