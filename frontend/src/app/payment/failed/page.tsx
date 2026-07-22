"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { AlertTriangle, RefreshCw, LayoutDashboard, HelpCircle } from "lucide-react";

export default function PaymentFailedPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-16 flex items-center justify-center">
        <div className="w-full bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-rose-500/40 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
          {/* Rose / Red Error Badge */}
          <div className="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-500/60 mx-auto flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/20">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-rose-400 tracking-widest">
              Қателік орын алды
            </span>
            <h1 className="text-3xl font-serif font-bold text-white">{t("payment.failed_title")}</h1>
            <p className="text-xs text-gray-400">{t("payment.failed_desc")}</p>
          </div>

          {/* Error Reason Box */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-left text-xs space-y-1 text-rose-300">
            <p className="font-bold">Мүмкін себептер:</p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-400">
              <li>Kaspi немесе Банк картасында қаражат жеткіліксіз</li>
              <li>Транзакция уақыты өтіп кетті</li>
              <li>Сессия үздігі пәрмені орын алды</li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <Link
              href="/payment/checkout"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t("payment.retry")}</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t("payment.to_dashboard")}</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
