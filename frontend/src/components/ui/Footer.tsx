"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, Heart, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#141426] text-white/70 border-t border-gold/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand & Tagline */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gold to-[#A68B4B] flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-ink" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-gold">
              TOYGA<span className="text-white">.KZ</span>
            </span>
          </Link>
          <p className="text-xs text-white/60 leading-relaxed">
            Қазақстандағы ең үздік цифрлық шақырулар платформасы. Тойыңыздың сәнін бізбен бірге арттырыңыз.
          </p>
          <div className="flex items-center space-x-4 text-xs text-gold/90 pt-2">
            <a href="tel:+77000000000" className="flex items-center hover:underline">
              <Phone className="w-3.5 h-3.5 mr-1" /> +7 (700) 000-00-00
            </a>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-gold tracking-wide uppercase">
            Шақыру түрлері
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/templates?category=uylenu-toy" className="hover:text-gold transition-colors">
                Үйлену той шақырулары
              </Link>
            </li>
            <li>
              <Link href="/templates?category=kyz-uzatu" className="hover:text-gold transition-colors">
                Қыз ұзату шаблондары
              </Link>
            </li>
            <li>
              <Link href="/templates?category=kudalyk" className="hover:text-gold transition-colors">
                Құдалық шақырулары
              </Link>
            </li>
            <li>
              <Link href="/templates?category=auyzashar" className="hover:text-gold transition-colors">
                Ауызашар шақырулары
              </Link>
            </li>
            <li>
              <Link href="/templates?category=tsusakeser" className="hover:text-gold transition-colors">
                Тұсаукесер шаблондары
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Navigation Links */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-gold tracking-wide uppercase">
            Навигация
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/templates" className="hover:text-gold transition-colors">
                Маркетплейс
              </Link>
            </li>
            <li>
              <Link href="/wizard" className="hover:text-gold transition-colors">
                Конструктор
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-gold transition-colors">
                Жеке кабинет
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-gold tracking-wide uppercase">
            Жаңалықтар мен жеңілдіктер
          </h4>
          <p className="text-xs text-white/60">
            Жаңа эксклюзивті шаблондар шыққанда бірінші болып хабардар болыңыз.
          </p>

          {subscribed ? (
            <div className="p-3 rounded-xl bg-teal/20 border border-teal/40 text-teal-300 text-xs font-semibold">
              Рахмет! Сіз сәтті жазылдыңыз.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Email мекенжайыңыз..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1A1A2E] text-xs h-10 border-white/15"
              />
              <Button type="submit" variant="primary" size="sm" className="w-full h-9 text-xs">
                <Send className="w-3.5 h-3.5 mr-1" /> Жазылу
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
        <div>&copy; {new Date().getFullYear()} Toyga.kz. Барлық құқықтар қорғалған.</div>
        <div className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Махаббатпен жасалған</span>
          <Heart className="w-3.5 h-3.5 text-rose fill-rose" />
          <span>Қазақстанда</span>
        </div>
      </div>
    </footer>
  );
}
