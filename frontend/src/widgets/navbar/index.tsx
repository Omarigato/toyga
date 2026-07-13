"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Avatar } from "@/shared/ui/avatar";
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
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-white/80 backdrop-blur-xl dark:border-stone-800/60 dark:bg-stone-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
            <span className="text-lg font-bold text-white">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Той<span className="text-amber-600">ға</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-stone-100 dark:hover:bg-stone-800", pathname === l.href ? "text-amber-600" : "text-stone-600 dark:text-stone-400")}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-1 rounded-lg bg-stone-100 p-0.5 dark:bg-stone-800">
            {(["kk", "ru", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLocale(l)} className={cn("rounded-md px-2 py-1 text-xs font-medium transition-colors", locale === l ? "bg-white shadow-sm text-stone-900 dark:bg-stone-700 dark:text-stone-100" : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </Button>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800">
                  <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
                  <ChevronDown className="hidden h-4 w-4 text-stone-400 sm:block" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl dark:border-stone-800 dark:bg-stone-950">
                      <div className="border-b px-3 py-2.5">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-stone-500">{user?.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-900"><LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}</Link>
                      <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-900"><Settings className="h-4 w-4" /> {t("nav.settings")}</Link>
                      <hr className="my-1 border-stone-100 dark:border-stone-800" />
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><LogOut className="h-4 w-4" /> {t("nav.logout")}</button>
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

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden dark:text-stone-400 dark:hover:bg-stone-800">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-stone-200 dark:border-stone-800 md:hidden">
            <nav className="space-y-1 px-4 py-3">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className={cn("block rounded-lg px-3 py-2.5 text-sm font-medium", pathname === l.href ? "bg-amber-50 text-amber-600" : "text-stone-600 hover:bg-stone-50 dark:text-stone-400")}>
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
