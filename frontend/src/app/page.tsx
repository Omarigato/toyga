"use client";

import Link from "next/link";
import { Navbar } from "@/widgets/navbar";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { SealSvg } from "@/shared/ui/seal-svg";
import { SectionDivider } from "@/shared/ui/section-divider";
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

      {/* Hero — dark qara-ink with gold accents */}
      <section className="relative overflow-hidden bg-[var(--color-ink)]">
        {/* Decorative ornament lines at edges */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <SealSvg size={600} className="absolute -right-40 -top-40 text-[var(--color-gold)]" />
          <SealSvg size={400} className="absolute -bottom-20 -left-20 text-[var(--color-gold)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            <motion.div variants={fadeUp}>
              <Badge className="mb-6"><Sparkles className="mr-1 h-3 w-3" /> v2.0</Badge>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-8 flex justify-center">
              <SealSvg size={80} className="text-[var(--color-gold)]" />
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display mx-auto max-w-4xl text-[var(--text-display-xl)] leading-[1.05] text-[var(--color-parchment)] sm:text-6xl lg:text-7xl">
              {t("hero.title").split(" ").slice(0, 3).join(" ")}
              <br />
              <span className="gradient-text">{t("hero.title").split(" ").slice(3).join(" ")}</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-steppe)] sm:text-xl">
              {t("hero.subtitle")}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register"><Button size="xl" className="group">{t("hero.cta")}<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></Button></Link>
              <Link href="/templates"><Button variant="wine" size="xl">{t("hero.ctaSecondary")}</Button></Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-steppe)]">
              {[t("hero.check1"), t("hero.check2"), t("hero.check3")].map((c) => (
                <span key={c} className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-[var(--color-gold)]" /> {c}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features — on parchment background */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.span variants={fadeUp} className="font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-steppe)]">{t("features.subtitle")}</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-[var(--text-display-lg)] font-semibold text-[var(--color-ink)]">{t("features.title")}</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="group h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-gold-20)] bg-[var(--color-gold-8)] text-[var(--color-gold)] transition-colors group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-ink)]">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-ink)]">{f.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-steppe)]">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.span variants={fadeUp} className="font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-steppe)]">Как это работает</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-[var(--text-display-lg)] font-semibold text-[var(--color-ink)]">{t("howItWorks.title")}</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-gold)] text-[var(--text-display-md)] font-bold text-[var(--color-ink)] shadow-lg shadow-[rgba(184,144,46,0.25)]">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-ink)]">{s.title}</h3>
                <p className="mt-2 text-[var(--color-steppe)]">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA — dark section */}
      <section className="bg-[var(--color-ink)] py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6 flex justify-center">
              <SealSvg size={48} className="text-[var(--color-gold)]" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-[var(--text-display-lg)] text-[var(--color-parchment)]">{t("cta.title")}</motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-[var(--color-steppe)]">{t("cta.subtitle")}</motion.p>
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
