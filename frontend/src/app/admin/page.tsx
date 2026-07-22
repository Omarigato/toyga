"use client";

import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Users, CreditCard, Layout, TrendingUp, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="border-b border-white/10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">SaaS Admin Panel</h1>
            <p className="text-sm text-gray-400 mt-1">Toyga.kz платформасының статистикасы мен басқару</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Super Admin</span>
          </span>
        </div>

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs uppercase font-semibold">Жалпы түсім</span>
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-white">708 580 ₸</p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs uppercase font-semibold">Қолданушылар</span>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-white">1 420</p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-sky-400">
              <span className="text-xs uppercase font-semibold">Шақырулар саны</span>
              <Layout className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-white">850</p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs uppercase font-semibold">Конверсия</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-white">68.4 %</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
