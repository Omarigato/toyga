"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/context/i18n-context";
import { Sparkles, Globe, LogOut, Menu, X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { lang, setLang, t } = useI18n();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-[#1A1A2E]/90 backdrop-blur-xl border-b border-gold/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-[#A68B4B] flex items-center justify-center shadow-lg shadow-gold/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-ink" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-gold">
            TOYGA<span className="text-white">.KZ</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/80">
          <Link href="/" className="hover:text-gold transition-colors">
            {t("nav.landing")}
          </Link>
          <Link href="/templates" className="hover:text-gold transition-colors">
            {t("nav.templates")}
          </Link>

          {isAuth && (
            <Link href="/dashboard" className="hover:text-gold transition-colors">
              {t("nav.dashboard")}
            </Link>
          )}

          {isAuth && isAdmin && (
            <Link href="/admin" className="hover:text-gold transition-colors">
              {t("nav.admin")}
            </Link>
          )}
        </nav>

        {/* Desktop Right Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center bg-[#252542] border border-white/10 rounded-full p-1">
            <Globe className="w-4 h-4 text-gold ml-2 mr-1" />
            <button
              type="button"
              onClick={() => setLang("kk")}
              className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                lang === "kk"
                  ? "bg-gradient-to-r from-gold to-[#A68B4B] text-ink shadow-sm"
                  : "text-white/60 hover:text-gold"
              }`}
            >
              ҚАЗ
            </button>
            <button
              type="button"
              onClick={() => setLang("ru")}
              className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                lang === "ru"
                  ? "bg-gradient-to-r from-gold to-[#A68B4B] text-ink shadow-sm"
                  : "text-white/60 hover:text-gold"
              }`}
            >
              РУС
            </button>
          </div>

          {/* CTA Create / Auth */}
          <Link href="/wizard">
            <Button variant="primary" size="sm" className="shadow-md">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Шақыру жасау
            </Button>
          </Link>

          {isAuth ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-crimson/20 hover:text-rose-300 text-white/60 text-xs border border-white/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("nav.logout")}</span>
            </button>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-gold"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A2E] border-b border-gold/20 p-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-white/80 hover:text-gold py-2"
          >
            {t("nav.landing")}
          </Link>
          <Link
            href="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-white/80 hover:text-gold py-2"
          >
            {t("nav.templates")}
          </Link>
          {isAuth && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-white/80 hover:text-gold py-2"
            >
              {t("nav.dashboard")}
            </Link>
          )}

          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center space-x-2 bg-[#252542] border border-white/10 rounded-full p-1">
              <button
                type="button"
                onClick={() => setLang("kk")}
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  lang === "kk" ? "bg-gold text-ink" : "text-white/60"
                }`}
              >
                ҚАЗ
              </button>
              <button
                type="button"
                onClick={() => setLang("ru")}
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  lang === "ru" ? "bg-gold text-ink" : "text-white/60"
                }`}
              >
                РУС
              </button>
            </div>

            {isAuth ? (
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-3.5 h-3.5 mr-1" /> Выйти
              </Button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
