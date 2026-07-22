"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/context/i18n-context";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Sparkles, Globe, User, LogOut } from "lucide-react";

export function Navbar() {
  const { lang, setLang, t } = useI18n();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("toyga_token");
    const role = localStorage.getItem("toyga_user_role");
    if (token) {
      setIsAuth(true);
      if (role === "admin") setIsAdmin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("toyga_token");
    localStorage.removeItem("toyga_user_role");
    setIsAuth(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-subtle transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-amber-500">
            TOYGA<span className="text-primary">.KZ</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-primary">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            {t("nav.landing")}
          </Link>
          <Link href="/templates" className="hover:text-amber-500 transition-colors">
            {t("nav.templates")}
          </Link>

          {/* Conditional Protected Links (Hidden if not logged in!) */}
          {isAuth && (
            <Link href="/dashboard" className="hover:text-amber-500 transition-colors">
              {t("nav.dashboard")}
            </Link>
          )}

          {isAuth && isAdmin && (
            <Link href="/admin" className="hover:text-amber-500 transition-colors">
              {t("nav.admin")}
            </Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* KK / RU Language Toggle */}
          <div className="flex items-center bg-surface border border-subtle rounded-full p-1">
            <Globe className="w-4 h-4 text-amber-500 ml-2 mr-1" />
            <button
              onClick={() => setLang("kk")}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                lang === "kk" ? "bg-amber-500 text-black shadow-md font-bold" : "text-secondary hover:text-amber-500"
              }`}
            >
              ҚАЗ
            </button>
            <button
              onClick={() => setLang("ru")}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                lang === "ru" ? "bg-amber-500 text-black shadow-md font-bold" : "text-secondary hover:text-amber-500"
              }`}
            >
              РУС
            </button>
          </div>

          {/* Auth CTA Button */}
          {isAuth ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-surface hover:bg-rose-500/20 hover:text-rose-500 text-secondary font-semibold text-xs border border-subtle transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("nav.logout")}</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 px-5 py-2.5 btn-apple-blue text-white font-semibold text-sm shadow-lg transition-all"
            >
              <User className="w-4 h-4" />
              <span>{t("nav.login")}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
