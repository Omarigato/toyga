"use client";

import React from "react";
import { useTheme } from "@/context/theme-context";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-amber-400 flex items-center justify-center"
      title={theme === "dark" ? "Жарық режимге өту" : "Қараңғы режимге өту"}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-stone-800" />}
    </button>
  );
}
