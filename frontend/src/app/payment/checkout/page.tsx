"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function PaymentCheckoutPage() {
  const router = useRouter();
  const [provider, setProvider] = useState<"kaspi" | "card">("kaspi");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleConfirmPay = () => {
    setConfirmModalOpen(false);
    router.push("/payment/success");
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-16 flex items-center justify-center">
        <Card hoverGlow className="w-full border-gold/30 p-4 space-y-6">
          <CardHeader className="text-center space-y-2">
            <Badge variant="gold">Бірреттік төлем</Badge>
            <CardTitle className="text-3xl text-gold">Шақыруды белсендіру</CardTitle>
            <CardDescription>
              Таңдалған "Алтын Шатыр Luxe" шаблонын шексіз қонақтармен жариялау
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Amount Box */}
            <div className="p-6 rounded-2xl bg-[#1A1A2E] border border-gold/30 text-center space-y-1">
              <span className="text-xs text-white/60">Төлем сомасы:</span>
              <div className="text-4xl font-serif font-bold text-gold">4 990 ₸</div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs text-white/70">Төлем тәсілін таңдаңыз:</label>

              <button
                type="button"
                onClick={() => setProvider("kaspi")}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  provider === "kaspi"
                    ? "bg-gold/20 border-gold text-white shadow-lg"
                    : "bg-[#1A1A2E] border-white/10 text-white/60 hover:border-gold/40"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-crimson font-bold text-white flex items-center justify-center text-sm">
                    Kaspi
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Kaspi Pay / QR</p>
                    <p className="text-xs text-white/50">Kaspi қосымшасы арқылы 0% комиссия</p>
                  </div>
                </div>
                {provider === "kaspi" && <CheckCircle2 className="w-5 h-5 text-gold" />}
              </button>

              <button
                type="button"
                onClick={() => setProvider("card")}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  provider === "card"
                    ? "bg-gold/20 border-gold text-white shadow-lg"
                    : "bg-[#1A1A2E] border-white/10 text-white/60 hover:border-gold/40"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal font-bold text-white flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Банк картасы</p>
                    <p className="text-xs text-white/50">Visa / Mastercard</p>
                  </div>
                </div>
                {provider === "card" && <CheckCircle2 className="w-5 h-5 text-gold" />}
              </button>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => setConfirmModalOpen(true)}
              className="w-full"
            >
              <span>Төлемге өту</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Confirmation Inner Dialog Pattern */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="bg-[#1A1A2E] border-gold/40">
          <DialogHeader>
            <DialogTitle>Төлемді растау</DialogTitle>
            <DialogDescription>
              Сіз {provider === "kaspi" ? "Kaspi Pay" : "Банк картасы"} арқылы 4 990 ₸ төлеуді таңдадыңыз.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-[#21213B] rounded-2xl border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Мероприятие:</span>
              <span className="font-bold text-gold">Омар & Маржан Үйлену Тойы</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Тариф:</span>
              <span className="font-bold text-white">Алтын Шатыр Luxe</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)} className="flex-1">
              Бас тарту
            </Button>
            <Button variant="primary" onClick={handleConfirmPay} className="flex-1">
              Растау және Төлеу
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
