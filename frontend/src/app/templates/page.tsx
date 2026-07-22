"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Eye, ArrowRight, Sparkles } from "lucide-react";

export default function TemplatesPage() {
  const { t } = useI18n();
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const categories = [
    { slug: "all", name: "Барлығы" },
    { slug: "uylenu-toy", name: "Үйлену той" },
    { slug: "kyz-uzatu", name: "Қыз ұзату" },
    { slug: "kudalyk", name: "Құдалық" },
    { slug: "auyzashar", name: "Ауызашар" },
    { slug: "tsusakeser", name: "Тұсаукесер" },
  ];

  const templates = [
    {
      id: "1",
      name: "Алтын Шатыр Luxe",
      slug: "altyn-shatyr-luxe",
      category: "uylenu-toy",
      price: "4 990 ₸",
      isPremium: true,
      tag: "Премиум",
      bg: "from-amber-900/60 to-[#1A1A2E]",
    },
    {
      id: "2",
      name: "Меруерт Нәзіктігі",
      slug: "meruert-naziktigi",
      category: "kyz-uzatu",
      price: "0 ₸",
      isPremium: false,
      tag: "Тегін",
      bg: "from-rose-950/60 to-[#1A1A2E]",
    },
    {
      id: "3",
      name: "Құдалық Сый-Құрмет",
      slug: "kudalyk-syi",
      category: "kudalyk",
      price: "4 990 ₸",
      isPremium: true,
      tag: "Люкс",
      bg: "from-amber-950/60 to-[#1A1A2E]",
    },
    {
      id: "4",
      name: "Рамазан Ауызашар",
      slug: "ramazan-auyzashar",
      category: "auyzashar",
      price: "0 ₸",
      isPremium: false,
      tag: "Тегін",
      bg: "from-emerald-950/60 to-[#1A1A2E]",
    },
    {
      id: "5",
      name: "Сәби Алғашқы Қадам",
      slug: "sabi-tsusakeser",
      category: "tsusakeser",
      price: "4 990 ₸",
      isPremium: true,
      tag: "Премиум",
      bg: "from-indigo-950/60 to-[#1A1A2E]",
    },
  ];

  const filtered =
    selectedCat === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCat);

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <Breadcrumb
          items={[
            { label: "Басты бет", href: "/" },
            { label: "Шаблондар маркетплейсі" },
          ]}
        />

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="gold">Эксклюзивті каталог</Badge>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gold">
            Шаблон таңдаңыз
          </h1>
          <p className="text-sm text-white/60">
            Барлық шаблондар музыкамен, 2GIS навигациясымен және RSVP жүйесімен қамтамасыз етілген.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all border ${
                selectedCat === cat.slug
                  ? "bg-gradient-to-r from-gold to-[#A68B4B] text-ink border-gold shadow-md font-bold"
                  : "bg-[#252542] text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tmpl) => (
            <Card
              key={tmpl.id}
              hoverGlow
              className="overflow-hidden flex flex-col justify-between border-gold/30"
            >
              {/* Card Banner */}
              <div
                className={`h-64 bg-gradient-to-br ${tmpl.bg} p-6 flex flex-col justify-between relative`}
              >
                <div className="flex justify-between items-center w-full">
                  <Badge variant={tmpl.isPremium ? "gold" : "teal"}>
                    {tmpl.tag}
                  </Badge>
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>

                <div className="text-center space-y-1 my-auto">
                  <span className="text-xs uppercase tracking-widest text-gold/90 font-bold">
                    TOYGA LUXE
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    {tmpl.name}
                  </h3>
                </div>
              </div>

              {/* Actions & Pricing */}
              <CardContent className="p-6 flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                  <span className="text-xs text-white/50">Бағасы:</span>
                  <p className="text-xl font-bold font-serif text-gold">
                    {tmpl.price}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/templates/${tmpl.slug}`}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gold transition-all"
                    title="Демо көру"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <Link href={`/wizard?template=${tmpl.id}`}>
                    <Button variant="primary" size="sm" className="text-xs">
                      <span>Таңдау</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
