"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialsMarquee, TestimonialItem } from "@/components/ui/testimonials-marquee";
import { Sparkles, ArrowRight, Heart, CheckCircle2, ShieldCheck, Zap, Music, MapPin, QrCode } from "lucide-react";

export default function LandingPage() {
  const { t } = useI18n();

  const categories = [
    { name: "Үйлену той", slug: "uylenu-toy", desc: "Премиум шақырулар", icon: Heart },
    { name: "Қыз ұзату", slug: "kyz-uzatu", desc: "Нәзік эстетика", icon: Sparkles },
    { name: "Құдалық", slug: "kudalyk", desc: "Сыйлы дастархан", icon: ShieldCheck },
    { name: "Ауызашар", slug: "auyzashar", desc: "Берекелі маусым", icon: Zap },
    { name: "Тұсаукесер", slug: "tsusakeser", desc: "Алғашқы қадам", icon: Heart },
  ];

  const testimonials: TestimonialItem[] = [
    {
      name: "Айжан & Бауыржан",
      role: "Үйлену той иелері (Алматы)",
      comment: "Алтын Шатыр Luxe шаблонын таңдадық. Қонақтарымыздың бәрі WhatsApp арқылы келген шақыруға сүйсінді! RSVP жинау өте ыңғайлы болды.",
      rating: 5,
    },
    {
      name: "Динара Асылбекқызы",
      role: "Қыз ұзату (Астана)",
      comment: "Музыкасы мен фотогалереясы тамаша қосылған. 2GIS картасының кнопкасы арқылы қонақтарымыз мейрамхананы оңай тапты.",
      rating: 5,
    },
    {
      name: "Ерлан Мұратұлы",
      role: "Құдалық ұйымдастырушы (Шымкент)",
      comment: "5 минуттың ішінде дайын шақыру жасап шықтым. QR код және қонақтар тізімі EXCEL форматында жүктеледі екен. 10/10!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Spotlight */}
        <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-gold/20 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <Spotlight fill="rgba(201, 169, 110, 0.25)" className="text-center space-y-8 py-16 px-6 sm:px-12">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-gold text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Премиум Люкс Цифрлық Шақырулар</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white leading-tight max-w-4xl mx-auto">
                Тойыңызға ең сәнді <br />
                <span className="text-gold italic">цифрлық шақыру</span> жасаңыз
              </h1>

              <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Музыка, интерактивті 2GIS карта, фотогалерея және WhatsApp арқылы лезде RSVP жинау. Оңай әрі эстетикалық.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/wizard">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
                    Шақыру жасау <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                    Шаблондарды көру
                  </Button>
                </Link>
              </div>
            </Spotlight>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="gold">Санаттар</Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gold">
              Кез келген қуанышыңызға арналған
            </h2>
            <p className="text-sm text-white/60">Үйлену тойдан тұсаукесерге дейін эксклюзивті дизайн</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link key={idx} href={`/templates?category=${cat.slug}`}>
                  <Card hoverGlow className="h-44 p-6 flex flex-col justify-between group cursor-pointer border-gold/30">
                    <div className="w-10 h-10 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white group-hover:text-gold transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-white/50">{cat.desc}</p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-[#141426] border-y border-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Неліктен <span className="text-gold">Toyga.kz</span> таңдайды?
              </h2>
              <p className="text-sm text-white/60">Заманауи той ұйымдастыруға арналған барлық функциялар</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                  <Music className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gold">Әуен мен Фотогалерея</h3>
                <p className="text-sm text-white/70">
                  Сүйікті тобыңыздың әнін қосып, ең әдемі фотосуреттеріңізді жоғары сапада орналастырыңыз.
                </p>
              </Card>

              <Card className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gold">2GIS & Яндекс Карта</h3>
                <p className="text-sm text-white/70">
                  Қонақтар мейрамхананы навигация батырмасын бір рет басу арқылы табады.
                </p>
              </Card>

              <Card className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gold">QR код & Легалды RSVP</h3>
                <p className="text-sm text-white/70">
                  Қонақтардың "Келемін / Келе алмаймын" жауаптарын CRM кестесінде бақылап отырыңыз.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Marquee */}
        <section className="py-20 space-y-8">
          <div className="text-center space-y-2 px-4">
            <Badge variant="gold">Пікірлер</Badge>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gold">
              Бізге сенім артқан той иелері
            </h2>
          </div>

          <TestimonialsMarquee items={testimonials} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
