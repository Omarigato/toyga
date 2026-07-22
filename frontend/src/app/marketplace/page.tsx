"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Sparkles, Eye, CheckCircle, ArrowRight } from "lucide-react";

export default function MarketplacePage() {
  const { t } = useI18n();
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const templates = [
    { id: "1", name: "Алтын Шатыр Luxe", category: "uylenu-toy", price: "4 990 ₸", tag: "Премиум", bg: "from-amber-900/40 to-amber-950/80" },
    { id: "2", name: "Меруерт Нәзіктігі", category: "kyz-uzatu", price: "0 ₸", tag: "Тегін", bg: "from-rose-900/40 to-rose-950/80" },
    { id: "3", name: "Құдалық Сый-Құрмет", category: "kudalyk", price: "4 990 ₸", tag: "Классика", bg: "from-amber-800/40 to-amber-900/80" },
    { id: "4", name: "Рамазан Ауызашар", category: "auyzashar", price: "0 ₸", tag: "Тегін", bg: "from-emerald-900/40 to-emerald-950/80" },
    { id: "5", name: "Сәби Алғашқы Қадам", category: "tsusakeser", price: "4 990 ₸", tag: "Премиум", bg: "from-sky-900/40 to-sky-950/80" }
  ];

  const filtered = selectedCat === "all" ? templates : templates.filter(t => t.category === selectedCat);

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-serif font-bold">Цифрлық шақырулар маркетплейсі</h1>
          <p className="text-gray-400 text-sm">Өзіңізге ұнаған сәнді шаблонды таңдап, бірнеше минутта шақыру жасаңыз</p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {["all", "uylenu-toy", "kyz-uzatu", "kudalyk", "auyzashar", "tsusakeser"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                selectedCat === cat
                  ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              {cat === "all" ? "Барлығы" : cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all group flex flex-col justify-between shadow-xl"
            >
              {/* Template Graphic Banner */}
              <div className={`h-64 bg-gradient-to-br ${tmpl.bg} p-6 flex flex-col justify-between relative`}>
                <span className="self-end px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-400">
                  {tmpl.tag}
                </span>

                <div className="text-center space-y-1">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">TOYGA LUXE</span>
                  <h3 className="text-2xl font-serif font-bold text-white">{tmpl.name}</h3>
                </div>
              </div>

              {/* Template Actions */}
              <div className="p-6 flex items-center justify-between border-t border-white/10">
                <div>
                  <span className="text-xs text-gray-400">Бағасы:</span>
                  <p className="text-xl font-bold font-serif text-amber-400">{tmpl.price}</p>
                </div>

                <Link
                  href={`/wizard?template=${tmpl.id}`}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center space-x-1 transition-all"
                >
                  <span>Таңдау</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
