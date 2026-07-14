"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/avatar";
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Bell, ChevronLeft, ChevronRight, Menu } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-[var(--color-gold)]" />
        <p className="text-xs font-medium uppercase tracking-widest text-stone-400">Загрузка</p>
      </div>
    </div>
  );
  if (!isAuthenticated) return null;

  const sidebarItems = [
    { href: "/events", label: "Мероприятия", icon: Calendar },
    { href: "/settings", label: "Настройки", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-stone-100 bg-white transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64",
        "hidden lg:flex"
      )}>
        <div className="flex h-16 items-center gap-2.5 border-b border-stone-100 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)]">
            <span className="text-sm font-bold text-white">Т</span>
          </div>
          {!collapsed && <span className="font-display text-xl font-semibold text-[var(--color-ink)]">Тойға</span>}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active ? "bg-stone-100 text-[var(--color-ink)]" : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
              )}>
                <item.icon className={cn("h-5 w-5 shrink-0", active && "text-[var(--color-gold)]")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-stone-100 p-3">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-stone-400">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm hover:text-stone-600"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-stone-100 bg-white lg:hidden"
            >
              <div className="flex h-16 items-center gap-2.5 border-b border-stone-100 px-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)]">
                  <span className="text-sm font-bold text-white">Т</span>
                </div>
                <span className="font-display text-xl font-semibold">Тойға</span>
              </div>
              <nav className="space-y-1 px-3 py-4">
                {sidebarItems.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      active ? "bg-stone-100 text-[var(--color-ink)]" : "text-stone-500 hover:bg-stone-50"
                    )}>
                      <item.icon className={cn("h-5 w-5", active && "text-[var(--color-gold)]")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={cn("flex-1 transition-all duration-300", collapsed ? "lg:ml-[68px]" : "lg:ml-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-stone-100 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <button className="relative rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
            <Bell className="h-5 w-5" />
          </button>
          <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
