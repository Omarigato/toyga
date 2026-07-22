"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("toyga_token", "mock_jwt_token_2026");
    localStorage.setItem("toyga_user_role", "user");
    document.cookie = "toyga_token=mock_jwt_token_2026; path=/";
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-16 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center">
          {/* Left Branding Panel */}
          <div className="space-y-6 hidden md:block">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shadow-lg">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-white leading-tight">
              TOYGA<span className="text-gold">.KZ</span> отбасына қосылыңыз
            </h1>
            <p className="text-sm text-white/70 leading-relaxed">
              Тіркеліп, алғашқы цифрлық шақыруыңызды тегін жасап көріңіз.
            </p>
            <div className="flex items-center space-x-3 text-xs text-gold/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Шексіз қонақтар тізімі мен автоматты RSVP</span>
            </div>
          </div>

          {/* Right Register Card */}
          <Card hoverGlow className="w-full border-gold/30 p-2 sm:p-4">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-2xl text-gold">Жаңа аккаунт ашу</CardTitle>
              <CardDescription>Деректеріңізді енгізіп, жүйеге тіркеліңіз</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Аты-жөніңіз (ФИО):</label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Абылай Хан"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70">Email мекенжайы:</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@toyga.kz"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70">Телефон нөміріңіз:</label>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (707) 123-45-67"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70">Пароль:</label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Тіркелу <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-white/60">
                Аккаунтыңыз бар ма?{" "}
                <Link href="/login" className="text-gold underline font-semibold hover:text-gold-deep">
                  Кіру
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
