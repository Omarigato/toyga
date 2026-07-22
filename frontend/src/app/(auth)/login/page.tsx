"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-input";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
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
          {/* Left Decorative Branding Panel */}
          <div className="space-y-6 hidden md:block">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shadow-lg">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-white leading-tight">
              TOYGA<span className="text-gold">.KZ</span> платформасына қош келдіңіз
            </h1>
            <p className="text-sm text-white/70 leading-relaxed">
              Барлық цифрлық шақыруларыңыз бен қонақтар тізімін (CRM) бір жерде басқарыңыз.
            </p>
            <div className="flex items-center space-x-3 text-xs text-gold/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>100% Қауіпсіз авторизация және деректерді қорғау</span>
            </div>
          </div>

          {/* Right Login Form Card */}
          <Card hoverGlow className="w-full border-gold/30 p-2 sm:p-4">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-2xl text-gold">Жүйеге кіру</CardTitle>
              <CardDescription>Жеке кабинетіңізге кіру тәсілін таңдаңыз</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">Email / Пароль</TabsTrigger>
                  <TabsTrigger value="otp">WhatsApp / SMS</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form onSubmit={handleLogin} className="space-y-4">
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
                      Кіру <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="otp">
                  {!otpSent ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (phone) setOtpSent(true);
                      }}
                      className="space-y-4"
                    >
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
                      <Button type="submit" variant="primary" size="lg" className="w-full">
                        Код жіберу
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-6 text-center">
                      <p className="text-xs text-white/70">
                        <span className="text-gold font-bold">{phone}</span> нөміріне жіберілген 6-таңбалы кодты енгізіңіз:
                      </p>
                      <OTPInput length={6} onComplete={() => {}} />
                      <Button type="submit" variant="primary" size="lg" className="w-full">
                        Растау және кіру
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-xs text-white/60">
                Тіркелмегенсіз бе?{" "}
                <Link href="/register" className="text-gold underline font-semibold hover:text-gold-deep">
                  Жаңа аккаунт ашу
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
