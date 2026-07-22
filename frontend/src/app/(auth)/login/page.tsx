"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Lock, Mail, Phone, User, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Жүйеге сәтті кірдіңіз!");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-16 flex items-center justify-center">
        <div className="w-full bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-bold text-white">Жүйеге кіру</h1>
            <p className="text-xs text-gray-400">TOYGA.KZ жеке кабинетіне қош келдіңіз</p>
          </div>

          {/* Auth Method Switcher */}
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setTab("email")}
              className={`flex-1 py-2 rounded-full transition-all ${
                tab === "email" ? "bg-amber-500 text-black shadow-md" : "text-gray-400"
              }`}
            >
              Email / Пароль
            </button>
            <button
              onClick={() => setTab("otp")}
              className={`flex-1 py-2 rounded-full transition-all ${
                tab === "otp" ? "bg-amber-500 text-black shadow-md" : "text-gray-400"
              }`}
            >
              SMS / WhatsApp OTP
            </button>
          </div>

          {/* Email / Password Form */}
          {tab === "email" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Email мекенжайы:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@toyga.kz"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mt-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Пароль:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mt-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
              >
                Кіру
              </button>
            </form>
          ) : (
            /* OTP Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Телефон нөміріңіз:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 707 123 45 67"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mt-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Аты-жөніңіз (ФИО):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Абылай Хан"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mt-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
              >
                Код жіберу & Кіру
              </button>
            </form>
          )}

          {/* Social Auth */}
          <div className="pt-4 border-t border-white/10 text-center space-y-3">
            <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
              <span>Google арқылы кіру</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
