"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Avatar } from "@/shared/ui/avatar";
import { Menu, X, ChevronDown, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t, locale, setLocale } = useI18n();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const links = [
    { href: "/", label: "Главная" },
    { href: "/wedding", label: "Свадьба" },
    { href: "/qyz-uzaty", label: "Қыз ұзату" },
    { href: "/sundet-toy", label: "Сүндет той" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)]">
            <span className="text-sm font-bold text-white">Т</span>
          </div>
          <span className="font-display text-xl font-semibold text-[var(--color-ink)]">Тойға</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-[var(--color-ink)] bg-stone-100" : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 rounded-xl bg-stone-100 p-0.5">
            {(["kk", "ru", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                  locale === l ? "bg-white shadow-sm text-stone-900" : "text-stone-400 hover:text-stone-600"
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-stone-100"
              >
                <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
                <ChevronDown className="hidden h-4 w-4 text-stone-400 sm:block" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-stone-100 bg-white p-1.5 shadow-xl"
                  >
                    <div className="border-b border-stone-100 px-3 py-2.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-stone-400">{user?.email}</p>
                    </div>
                    <Link
                      href="/events"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-stone-50"
                    >
                      <LayoutDashboard className="h-4 w-4 text-stone-400" /> Мои мероприятия
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-stone-50"
                    >
                      <Settings className="h-4 w-4 text-stone-400" /> Настройки
                    </Link>
                    <hr className="my-1 border-stone-100" />
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--color-error)] hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Выйти
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"><Button variant="ghost" size="sm">Войти</Button></Link>
              <Link href="/register"><Button size="sm">Начать</Button></Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-stone-100 md:hidden"
          >
            <nav className="space-y-1 px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium",
                    pathname === l.href ? "bg-stone-100 text-[var(--color-ink)]" : "text-stone-500 hover:bg-stone-50"
                  )}
                >
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
