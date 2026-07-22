"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Eye, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function TemplatesPage() {
  const { t } = useI18n();
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const templates = [
    { id: "1", name: "Алтын Шатыр Luxe", slug: "altyn-shatyr-luxe", category: "uylenu-toy", price: "4 990 ₸", tag: t("templates.tag_luxe"), bg: "from-amber-900/40 to-black" },
    { id: "2", name: "Меруерт Нәзіктігі", slug: "meruert-naziktigi", category: "kyz-uzatu", price: "0 ₸", tag: t("templates.tag_free"), bg: "from-rose-900/40 to-black" },
    { id: "3", name: "Құдалық Сый-Құрмет", slug: "kudalyk-syi", category: "kudalyk", price: "4 990 ₸", tag: t("templates.tag_classic"), bg: "from-amber-800/40 to-black" },
    { id: "4", name: "Рамазан Ауызашар", slug: "ramazan-auyzashar", category: "auyzashar", price: "0 ₸", tag: t("templates.tag_free"), bg: "from-emerald-900/40 to-black" },
    { id: "5", name: "Сәби Алғашқы Қадам", slug: "sabi-tsusakeser", category: "tsusakeser", price: "4 990 ₸", tag: t("templates.tag_luxe"), bg: "from-sky-900/40 to-black" }
  ];

  const filtered = selectedCat === "all" ? templates : templates.filter((t) => t.category === selectedCat);

  return (
    <div className="min-h-screen bg-[#000000] dark:bg-[#000000] light:bg-[#f5f5f7] text-white dark:text-white light:text-[#1d1d1f] flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">{t("templates.title")}</h1>
          <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">{t("templates.subtitle")}</p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {["all", "uylenu-toy", "kyz-uzatu", "kudalyk", "auyzashar", "tsusakeser"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all border ${
                selectedCat === cat
                  ? "bg-[#0071e3] text-white border-blue-400 shadow-lg shadow-blue-500/20 font-bold"
                  : "bg-white/5 dark:bg-white/5 light:bg-white text-gray-400 dark:text-gray-400 light:text-gray-700 border-white/10 dark:border-white/10 light:border-black/10 hover:text-amber-400"
              }`}
            >
              {cat === "all" ? t("templates.filter_all") : cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-gradient-to-b from-[#1c1c1e] to-[#121214] dark:from-[#1c1c1e] dark:to-[#121214] light:from-white light:to-stone-50 border border-white/10 dark:border-white/10 light:border-black/10 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all group flex flex-col justify-between shadow-xl"
            >
              {/* Card Banner */}
              <div className={`h-64 bg-gradient-to-br ${tmpl.bg} p-6 flex flex-col justify-between relative`}>
                <span className="self-end px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-400">
                  {tmpl.tag}
                </span>

                <div className="text-center space-y-1">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">TOYGA LUXE</span>
                  <h3 className="text-2xl font-serif font-bold text-white">{tmpl.name}</h3>
                </div>
              </div>

              {/* Actions & Pricing */}
              <div className="p-6 flex items-center justify-between border-t border-white/10 dark:border-white/10 light:border-black/10">
                <div>
                  <span className="text-xs text-gray-400">{t("templates.price_label")}</span>
                  <p className="text-xl font-bold font-serif text-amber-500">{tmpl.price}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Demo Link */}
                  <Link
                    href={`/templates/demo/${tmpl.slug}`}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-400 transition-all"
                    title={t("templates.btn_demo")}
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {/* Select Template CTA */}
                  <Link
                    href={`/wizard?template=${tmpl.id}`}
                    className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0066cc] text-white font-bold text-xs flex items-center space-x-1 transition-all shadow-md"
                  >
                    <span>{t("templates.btn_select")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
