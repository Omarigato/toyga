"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const { lang } = useI18n();

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
          <Sparkles className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-serif font-extrabold text-amber-500">404</h1>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          {lang === "kk" ? "Бет табылмады" : "Страница не найдена"}
        </h2>

        <p className="text-sm text-gray-400 max-w-md">
          {lang === "kk"
            ? "Сіз іздеген бет жойылған немесе мекенжайы қате енгізілген болуы мүмкін."
            : "Запрошенная страница не существует или была перемещена."}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:scale-105 shadow-xl shadow-amber-500/20 transition-all flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>{lang === "kk" ? "Басты бетке қайту" : "Вернуться на главную"}</span>
          </Link>
          <Link
            href="/marketplace"
            className="px-8 py-3.5 rounded-full bg-white/5 border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "kk" ? "Шаблондар маркетплейсі" : "Маркетплейс шаблонов"}</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
