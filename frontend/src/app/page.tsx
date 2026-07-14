"use client";

import Link from "next/link";
import { Navbar } from "@/widgets/navbar";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/i18n/provider";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Heart, Palette, Users, Sparkles, Star } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function HomePage() {
  const { t } = useI18n();

  const categories = [
    { href: "/wedding", title: "Той шақыру", desc: "Свадебные приглашения", icon: Heart, color: "from-rose-50 to-pink-50", accent: "text-rose-500" },
    { href: "/qyz-uzaty", title: "Қыз ұзату", desc: "Приглашения на кыз узату", icon: Star, color: "from-emerald-50 to-teal-50", accent: "text-emerald-600" },
    { href: "/sundet-toy", title: "Сүндет той", desc: "Приглашения на сүннет той", icon: Sparkles, color: "from-blue-50 to-indigo-50", accent: "text-blue-600" },
  ];

  const steps = [
    { step: "01", title: "Выберите шаблон", desc: "Красивые дизайны для любого торжества" },
    { step: "02", title: "Настройте дизайн", desc: "Добавьте фото, текст и детали" },
    { step: "03", title: "Поделитесь с гостями", desc: "Отправьте ссылку или скачайте картинку" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[var(--color-gold)]/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[var(--color-rose)]/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-1.5 text-sm text-stone-600">
              <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
              Цифровые приглашения нового поколения
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display mx-auto max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
              Создайте <span className="text-[var(--color-gold)]">незабываемое</span>{" "}
              приглашение для вашего торжества
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-stone-500 sm:text-xl">
              Красивые шаблоны, простой редактор, мгновенная отправка гостям.
              Бесплатно создавайте цифровые приглашения для свадьбы, дня рождения и других событий.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" className="group">
                  Начать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/wedding">
                <Button variant="outline" size="xl">Смотреть шаблоны</Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
              {["Бесплатно", "Без карты", "5 минут до готовности"].map((c) => (
                <span key={c} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-gold)]" />
                  {c}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.span variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-stone-400">Категории</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">Выберите тип торжества</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-6 sm:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link href={cat.href} className="group block">
                  <div className={`rounded-3xl bg-gradient-to-br ${cat.color} p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${cat.accent}`}>
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-stone-900">{cat.title}</h3>
                    <p className="mt-2 text-sm text-stone-600">{cat.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-stone-700 group-hover:gap-2 transition-all">
                      Смотреть <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-stone-100 bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.span variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-stone-400">Как это работает</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">3 простых шага</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-lg font-bold text-white">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-stone-500">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-ink)] py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-display text-3xl font-bold text-white sm:text-4xl">Готовы создать приглашение?</motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-stone-400">
              Начните бесплатно прямо сейчас. Регистрация занимает 30 секунд.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link href="/register">
                <Button size="xl" variant="gold" className="group">
                  Создать приглашение
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
