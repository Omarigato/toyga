"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
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

  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" /></div>;
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
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Desktop Sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r border-stone-200 bg-white transition-all duration-300 dark:border-stone-800 dark:bg-stone-950", collapsed ? "w-[68px]" : "w-64", "hidden lg:flex")}>
        <div className="flex h-16 items-center gap-2.5 border-b border-stone-200 px-4 dark:border-stone-800">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600"><span className="text-sm font-bold text-white">T</span></div>
          {!collapsed && <span className="text-lg font-bold">Той<span className="text-amber-600">ға</span></span>}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all", active ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-900")}>
                <item.icon className={cn("h-5 w-5 shrink-0", active && "text-amber-600")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-stone-200 p-3 dark:border-stone-800">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
            {!collapsed && <div className="flex-1 overflow-hidden"><p className="truncate text-sm font-medium">{user?.name}</p><p className="truncate text-xs text-stone-500">{user?.email}</p></div>}
          </div>
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm hover:text-stone-600 dark:border-stone-800 dark:bg-stone-950">
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed inset-y-0 left-0 z-50 w-64 border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 lg:hidden">
              <div className="flex h-16 items-center gap-2.5 border-b border-stone-200 px-4 dark:border-stone-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600"><span className="text-sm font-bold text-white">T</span></div>
                <span className="text-lg font-bold">Той<span className="text-amber-600">ға</span></span>
              </div>
              <nav className="space-y-1 px-3 py-4">
                {sidebarItems.map((item) => {
                  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all", active ? "bg-amber-50 text-amber-700" : "text-stone-600 hover:bg-stone-100")}>
                      <item.icon className="h-5 w-5" /><span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={cn("flex-1 transition-all duration-300", collapsed ? "lg:ml-[68px]" : "lg:ml-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-stone-200 bg-white/80 px-4 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/80 sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 lg:hidden dark:text-stone-400 dark:hover:bg-stone-800"><Menu className="h-5 w-5" /></button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="relative"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" /></Button>
          <Avatar src={user?.avatarUrl} fallback={user?.name} size="sm" />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
