"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/avatar";
import { SealSvg } from "@/shared/ui/seal-svg";
import { LayoutDashboard, Calendar, Sparkles, Users, Image, Settings, LogOut, Bell, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, fetchUser } = useAuthStore();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => { fetchUser(); }, [fetchUser]);
  React.useEffect(() => { if (!isLoading && !isAuthenticated) router.push("/login"); }, [isLoading, isAuthenticated, router]);

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-parchment)]">
      <div className="flex flex-col items-center gap-4">
        <SealSvg size={48} className="text-[var(--color-gold)] animate-spin" />
        <p className="font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-steppe)]">Загрузка</p>
      </div>
    </div>
  );
  if (!isAuthenticated) return null;

  const sidebarItems = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/events", label: t("nav.events"), icon: Calendar },
    { href: "/templates", label: t("nav.templates"), icon: Sparkles },
    { href: "/guests", label: t("nav.guests"), icon: Users },
    { href: "/media", label: t("nav.media"), icon: Image },
    { href: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-parchment)]">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[var(--color-gold-12)] bg-[var(--color-parchment)] transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64",
        "hidden lg:flex"
      )}>
        <div className="flex h-16 items-center gap-2.5 border-b border-[var(--color-gold-12)] px-4">
          <SealSvg size={28} />
          {!collapsed && <span className="font-body text-lg font-semibold">Той<span className="text-[var(--color-gold)]">ға</span></span>}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active ? "bg-[var(--color-gold-8)] text-[var(--color-ink)]" : "text-[var(--color-steppe)] hover:bg-[var(--color-steppe-15)] hover:text-[var(--color-ink)]"
              )}>
                <item.icon className={cn("h-5 w-5 shrink-0", active && "text-[var(--color-gold)]")} />
                {!collapsed && <span>{item.label}</span>}
                {active && <span className="absolute bottom-1 left-3 h-0.5 w-4 rounded-full bg-[var(--color-gold)]" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--color-gold-12)] p-3">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
            {!collapsed && <div className="flex-1 overflow-hidden"><p className="truncate text-sm font-medium">{user?.name}</p><p className="truncate text-xs text-[var(--color-steppe)]">{user?.email}</p></div>}
          </div>
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-gold-12)] bg-[var(--color-parchment)] text-[var(--color-steppe)] shadow-sm hover:text-[var(--color-ink)]">
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-[var(--color-ink-72)] backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--color-gold-12)] bg-[var(--color-parchment)] lg:hidden">
              <div className="flex h-16 items-center gap-2.5 border-b border-[var(--color-gold-12)] px-4">
                <SealSvg size={28} />
                <span className="font-body text-lg font-semibold">Той<span className="text-[var(--color-gold)]">ға</span></span>
              </div>
              <nav className="space-y-1 px-3 py-4">
                {sidebarItems.map((item) => {
                  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      active ? "bg-[var(--color-gold-8)] text-[var(--color-ink)]" : "text-[var(--color-steppe)] hover:bg-[var(--color-steppe-15)]"
                    )}>
                      <item.icon className={cn("h-5 w-5", active && "text-[var(--color-gold)]")} /><span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={cn("flex-1 transition-all duration-300", collapsed ? "lg:ml-[68px]" : "lg:ml-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--color-gold-12)] bg-[var(--color-parchment-95)] px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-[var(--color-steppe)] hover:bg-[var(--color-gold-8)] lg:hidden"><Menu className="h-5 w-5" /></button>
          <div className="flex-1" />
          <button className="relative rounded-lg p-2 text-[var(--color-steppe)] hover:bg-[var(--color-gold-8)]"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-wine)]" /></button>
          <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
