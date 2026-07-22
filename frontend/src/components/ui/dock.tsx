"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

interface DockProps {
  items: DockItem[];
  className?: string;
}

export const Dock: React.FC<DockProps> = ({ items, className }) => {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-2 rounded-full border border-gold/40 bg-[#1A1A2E]/90 p-2 shadow-2xl backdrop-blur-xl gold-glow",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          title={item.label}
          className={cn(
            "flex flex-col items-center justify-center w-12 h-12 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer",
            item.active
              ? "bg-gradient-to-r from-gold to-[#A68B4B] text-ink shadow-md scale-110"
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <div className="w-5 h-5">{item.icon}</div>
          <span className="sr-only">{item.label}</span>
        </button>
      ))}
    </div>
  );
};
