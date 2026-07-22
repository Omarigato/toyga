"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Sparkles, ArrowRight, Heart, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const { t } = useI18n();

  const categories = [
    { name: t("categories.uylenu"), slug: "uylenu-toy", bg: "from-amber-500/20 to-amber-900/10", border: "border-amber-500/30" },
    { name: t("categories.kyz_uzatu"), slug: "kyz-uzatu", bg: "from-rose-500/20 to-rose-900/10", border: "border-rose-500/30" },
    { name: t("categories.kudalyk"), slug: "kudalyk", bg: "from-amber-600/20 to-amber-950/10", border: "border-amber-600/30" },
    { name: t("categories.auyzashar"), slug: "auyzashar", bg: "from-emerald-500/20 to-emerald-900/10", border: "border-emerald-500/30" },
    { name: t("categories.tsusakeser"), slug: "tsusakeser", bg: "from-sky-500/20 to-sky-900/10", border: "border-sky-500/30" },
  ];

  return (
    <div className="min-h-screen bg-primary text-primary flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Cinematic Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden border-b border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            {/* Apple Style Capsule Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Main Headline (Always readable in dark & light theme!) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-primary">
              {t("hero.title")}
            </h1>

            <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/wizard"
                className="w-full sm:w-auto px-8 py-4 btn-apple-blue text-white font-bold text-base shadow-xl flex items-center justify-center space-x-2"
              >
                <span>{t("hero.cta")}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/templates"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface border border-subtle text-primary font-semibold text-base hover:opacity-80 transition-all flex items-center justify-center"
              >
                <span>{t("hero.demo")}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-primary">
              {t("categories.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/templates?category=${cat.slug}`}
                className={`p-6 rounded-3xl bg-card border ${cat.border} hover:scale-105 transition-all group flex flex-col justify-between h-48 shadow-xl`}
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-primary group-hover:text-amber-500 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-secondary">{t("categories.view_templates")} &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Single Purchase Pricing Section (No Subscriptions!) */}
        <section className="py-24 bg-surface border-t border-subtle">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold text-amber-500 tracking-widest">
                Разовое создание
              </span>
              <h2 className="text-4xl font-serif font-bold text-primary">
                {t("pricing.title")}
              </h2>
              <p className="text-secondary text-sm">
                {t("pricing.subtitle")}
              </p>
            </div>

            <div className="p-8 sm:p-12 rounded-3xl bg-card border border-amber-500/30 shadow-2xl space-y-8">
              <div className="text-5xl font-serif font-extrabold text-amber-500">
                {t("pricing.price")}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm text-secondary">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>{t("pricing.feature1")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>{t("pricing.feature2")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>{t("pricing.feature3")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>{t("pricing.feature4")}</span>
                </div>
              </div>

              <Link
                href="/wizard"
                className="w-full py-4 btn-apple-blue text-white font-bold text-base block shadow-xl"
              >
                {t("hero.cta")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
