"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Palette,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
  className?: string;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  isAdmin = false,
  className,
}) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: "Мои мероприятия", href: "/dashboard", icon: Calendar },
    { label: "Гости (CRM)", href: "/crm/demo", icon: Users },
    { label: "Маркетплейс", href: "/templates", icon: Palette },
    { label: "Платежи", href: "/payment/checkout", icon: CreditCard },
  ];

  if (isAdmin) {
    menuItems.push({ label: "Админ-панель", href: "/admin", icon: ShieldCheck });
  }

  const handleLogout = () => {
    localStorage.removeItem("toyga_token");
    localStorage.removeItem("toyga_user_role");
    window.location.href = "/";
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-gold/20 bg-[#141426] text-white transition-all duration-300 z-30 shrink-0",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Collapse Toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-7 flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-[#1A1A2E] text-gold hover:bg-gold hover:text-ink transition-colors shadow-md z-40"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Brand Header */}
      <div className="flex h-20 items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gold to-[#A68B4B] flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-4 h-4 text-ink" />
          </div>
          {!collapsed && (
            <span className="font-serif text-xl font-bold text-gold tracking-tight whitespace-nowrap">
              TOYGA<span className="text-white">.KZ</span>
            </span>
          )}
        </Link>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-gold to-[#A68B4B] text-ink shadow-md shadow-gold/10"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-ink" : "text-gold/80")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-rose-300 hover:bg-crimson/20 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 text-rose-300" />
          {!collapsed && <span>Шығу</span>}
        </button>
      </div>
    </aside>
  );
};
