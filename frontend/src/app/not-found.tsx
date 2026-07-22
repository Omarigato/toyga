"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto px-4 py-24 flex items-center justify-center">
        <Card hoverGlow className="w-full border-gold/30 p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold mx-auto shadow-xl">
            <Sparkles className="w-10 h-10" />
          </div>

          <h1 className="text-6xl font-serif font-bold text-gold">404</h1>

          <h2 className="text-2xl font-serif font-bold text-white">
            Бет табылмады
          </h2>

          <p className="text-xs text-white/60">
            Сіз іздеген бет жойылған немесе мекенжайы қате енгізілген болуы мүмкін.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button variant="primary" size="default">
                <Home className="w-4 h-4 mr-2" /> Басты бетке қайту
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="default">
                <ArrowLeft className="w-4 h-4 mr-2" /> Маркетплейс
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
