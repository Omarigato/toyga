"use client";

import Link from "next/link";
import { Navbar } from "@/widgets/navbar";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { useI18n } from "@/shared/i18n/provider";
import { motion } from "framer-motion";
import { Sparkles, Palette, Smartphone, Users, Clock, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function HomePage() {
  const { t } = useI18n();

  const features = [
    { icon: Palette, title: t("features.beautiful"), desc: t("features.beautifulDesc") },
    { icon: Smartphone, title: t("features.whatsapp"), desc: t("features.whatsappDesc") },
    { icon: Users, title: t("features.guests"), desc: t("features.guestsDesc") },
    { icon: Clock, title: t("features.countdown"), desc: t("features.countdownDesc") },
    { icon: Shield, title: t("features.secure"), desc: t("features.secureDesc") },
    { icon: Zap, title: t("features.fast"), desc: t("features.fastDesc") },
  ];

  const steps = [
    { step: "01", title: t("howItWorks.step1"), desc: t("howItWorks.step1Desc") },
    { step: "02", title: t("howItWorks.step2"), desc: t("howItWorks.step2Desc") },
    { step: "03", title: t("howItWorks.step3"), desc: t("howItWorks.step3Desc") },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            <motion.div variants={fadeUp}>
              <Badge className="mb-6"><Sparkles className="mr-1 h-3 w-3" /> v2.0</Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">{t("hero.title").split(" ").slice(0, 3).join(" ")}</span>
              <br />
              {t("hero.title").split(" ").slice(3).join(" ")}
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-stone-500 dark:text-stone-400 sm:text-xl">
              {t("hero.subtitle")}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register"><Button size="xl" className="group">{t("hero.cta")}<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></Button></Link>
              <Link href="/templates"><Button variant="outline" size="xl">{t("hero.ctaSecondary")}</Button></Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-400">
              {[t("hero.check1"), t("hero.check2"), t("hero.check3")].map((c) => (
                <span key={c} className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {c}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">{t("features.title")}</motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-stone-500">{t("features.subtitle")}</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="group h-full transition-all hover:shadow-lg hover:shadow-amber-500/5">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-stone-500">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-50 py-24 dark:bg-stone-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">{t("howItWorks.title")}</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-2xl font-bold text-white shadow-lg shadow-amber-500/25">{s.step}</div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-stone-500">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">{t("cta.title")}</motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-stone-500">{t("cta.subtitle")}</motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link href="/register"><Button size="xl" className="group">{t("cta.button")}<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
