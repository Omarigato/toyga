"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Plus, Calendar, Users, Share2, ExternalLink, CreditCard, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { t } = useI18n();

  const userEvents = [
    {
      id: "ev1",
      title: "Омар & Маржан Үйлену Тойы",
      type: "Үйлену той",
      date: "25 Тамыз 2026",
      status: "Жарияланған",
      isPaid: true,
      guestsCount: 142,
      slug: "omar-marzhan"
    }
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Мои мероприятия</h1>
            <p className="text-sm text-gray-400 mt-1">Барлық жасалған той-шақыруларыңыз бен қонақтар статистикасы</p>
          </div>

          <Link
            href="/wizard"
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:scale-105 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Жаңа шақыру жасау</span>
          </Link>
        </div>

        {/* User Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-amber-500/30 shadow-2xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    {ev.status}
                  </span>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">{ev.type}</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white">{ev.title}</h3>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>{ev.guestsCount} қонақ тіркелді</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <Link
                  href={`/crm/${ev.id}`}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-all flex items-center justify-center space-x-1"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Қонақтар CRM</span>
                </Link>

                <Link
                  href={`/i/${ev.slug}/erzhan`}
                  target="_blank"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs text-center transition-all flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Шақыруды көру</span>
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
