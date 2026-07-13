"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Avatar } from "@/shared/ui/avatar";
import { SealSvg } from "@/shared/ui/seal-svg";
import { Menu, X, Bell, ChevronDown, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t, locale, setLocale } = useI18n();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/templates", label: t("nav.templates") },
  ];

  return (
    <header className="sticky top-0 z-50 glass-light">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <SealSvg size={28} />
          <span className="font-body text-xl font-semibold text-[var(--color-ink)]">Той<span className="text-[var(--color-gold)]">ға</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={cn("relative rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "text-[var(--color-ink)]" : "text-[var(--color-steppe)] hover:text-[var(--color-ink)]")}>
                {l.label}
                {active && <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--color-gold)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 rounded-lg bg-[var(--color-steppe-15)] p-0.5">
            {(["kk", "ru", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLocale(l)} className={cn("rounded-md px-2 py-1 text-xs font-medium transition-colors", locale === l ? "bg-[var(--color-parchment)] shadow-sm text-[var(--color-ink)]" : "text-[var(--color-steppe)] hover:text-[var(--color-ink)]")}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-wine)]" />
              </Button>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-[var(--color-gold-8)]">
                  <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
                  <ChevronDown className="hidden h-4 w-4 text-[var(--color-steppe)] sm:block" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--color-gold-12)] bg-[var(--color-parchment)] p-1.5 shadow-[var(--shadow-seal)]">
                      <div className="border-b border-[var(--color-gold-12)] px-3 py-2.5">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-[var(--color-steppe)]">{user?.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--color-gold-8)]"><LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}</Link>
                      <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--color-gold-8)]"><Settings className="h-4 w-4" /> {t("nav.settings")}</Link>
                      <hr className="my-1 border-[var(--color-gold-12)]" />
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-wine)] hover:bg-[var(--color-wine-10)]"><LogOut className="h-4 w-4" /> {t("nav.logout")}</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"><Button variant="ghost" size="sm">{t("nav.login")}</Button></Link>
              <Link href="/register"><Button size="sm">{t("nav.register")}</Button></Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-[var(--color-steppe)] hover:bg-[var(--color-gold-8)] md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[var(--color-gold-12)] md:hidden">
            <nav className="space-y-1 px-4 py-3">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className={cn("block rounded-lg px-3 py-2.5 text-sm font-medium", pathname === l.href ? "bg-[var(--color-gold-8)] text-[var(--color-gold)]" : "text-[var(--color-steppe)] hover:bg-[var(--color-steppe-15)]")}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
