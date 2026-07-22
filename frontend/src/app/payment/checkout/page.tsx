"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { CreditCard, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function PaymentCheckoutPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [provider, setProvider] = useState<"kaspi" | "card">("kaspi");

  const handlePay = () => {
    // Simulate successful payment checkout callback
    router.push("/payment/success");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-16 flex items-center justify-center">
        <div className="w-full bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-widest">
              Разовая активация
            </span>
            <h1 className="text-3xl font-serif font-bold text-white">{t("payment.checkout_title")}</h1>
            <p className="text-xs text-gray-400">{t("payment.checkout_subtitle")}</p>
          </div>

          {/* Amount Box */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-xs text-gray-400">Төлем сомасы:</span>
            <div className="text-4xl font-serif font-bold text-amber-400">4 990 ₸</div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-xs text-gray-400">Төлем тәсілін таңдаңыз:</label>

            <button
              type="button"
              onClick={() => setProvider("kaspi")}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                provider === "kaspi"
                  ? "bg-amber-500/20 border-amber-400 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 font-bold text-white flex items-center justify-center text-sm">
                  Kaspi
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t("payment.kaspi_option")}</p>
                  <p className="text-xs text-gray-400">Kaspi QR немесе номер арқылы</p>
                </div>
              </div>
              {provider === "kaspi" && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => setProvider("card")}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                provider === "card"
                  ? "bg-amber-500/20 border-amber-400 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 font-bold text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t("payment.card_option")}</p>
                  <p className="text-xs text-gray-400">Visa / Mastercard</p>
                </div>
              </div>
              {provider === "card" && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handlePay}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
          >
            <span>{t("payment.pay_button")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
