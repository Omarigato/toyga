"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { CheckCircle2, ExternalLink, LayoutDashboard, Share2, Sparkles } from "lucide-react";

export default function PaymentSuccessPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-16 flex items-center justify-center">
        <div className="w-full bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-emerald-500/40 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
          {/* Gold / Emerald Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/60 mx-auto flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-widest">
              Транзакция сәтті өтті
            </span>
            <h1 className="text-3xl font-serif font-bold text-white">{t("payment.success_title")}</h1>
            <p className="text-xs text-gray-400">{t("payment.success_desc")}</p>
          </div>

          {/* Receipt Details Box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Транзакция ID:</span>
              <span className="font-mono text-amber-400 font-bold">TX-TYG-89F4A21B</span>
            </div>
            <div className="flex justify-between">
              <span>Төленген сома:</span>
              <span className="font-bold text-white">4 990 ₸</span>
            </div>
            <div className="flex justify-between">
              <span>Статус:</span>
              <span className="text-emerald-400 font-bold">Белсендірілді</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <Link
              href="/i/omar-marzhan/erzhan"
              target="_blank"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t("payment.open_invitation")}</span>
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
