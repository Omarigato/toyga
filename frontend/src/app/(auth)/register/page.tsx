"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { User, Mail, Lock, Phone } from "lucide-react";

export default function RegisterPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Тіркелу сәтті өтті!");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-16 flex items-center justify-center">
        <div className="w-full bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-bold text-white">Тіркелу</h1>
            <p className="text-xs text-gray-400">TOYGA.KZ жүйесінде жаңа аккаунт ашыңыз</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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
              Тіркелу
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 pt-2">
            Аккаунтыңыз бар ма?{" "}
            <Link href="/login" className="text-amber-400 font-bold hover:underline">
              Кіру
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
