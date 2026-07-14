"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/widgets/navbar";
import { Footer } from "@/widgets/footer";
import { CategoryHero } from "@/widgets/category-hero";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { SealSvg } from "@/shared/ui/seal-svg";
import { useTemplates, useCloneTemplate } from "@/shared/lib/queries";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Gift, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function SundetToyPage() {
  const router = useRouter();
  const { data: templates = [], isLoading } = useTemplates("sundet");
  const cloneTemplate = useCloneTemplate();

  const handleUseTemplate = async (templateId: string) => {
    const result: any = await cloneTemplate.mutateAsync(templateId);
    if (result?.id) {
      router.push(`/events/${result.id}/editor`);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero — warm cream-blue playful elements */}
      <CategoryHero
        title="Сүндет той"
        subtitle="Приглашение на сүннет той — важное событие в жизни мальчика. Тёплые тона и уютный дизайн для семейного торжества."
        gradientFrom="#4A6741"
        gradientTo="#8DB580"
      >
        {/* Playful toy-element decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Star shapes */}
          <svg
            className="absolute left-[15%] top-[20%] h-8 w-8 text-white/10"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg
            className="absolute right-[20%] top-[30%] h-6 w-6 text-white/10"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg
            className="absolute bottom-[30%] left-[30%] h-5 w-5 text-white/8"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>

          {/* Soft circular glows */}
          <div
            className="absolute right-[10%] top-[15%] h-40 w-40 rounded-full opacity-8"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2), transparent)" }}
          />
          <div
            className="absolute bottom-[15%] left-[10%] h-32 w-32 rounded-full opacity-6"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent)" }}
          />

          {/* Dots pattern */}
          <div className="absolute right-[30%] bottom-[20%] grid grid-cols-4 gap-1.5 opacity-[0.08]">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-white" />
            ))}
          </div>
        </div>
      </CategoryHero>

      {/* Templates gallery */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.span
              variants={fadeUp}
              className="font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-steppe)]"
            >
              Шаблоны для сүндет той
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-[var(--text-display-lg)] font-semibold text-[var(--color-ink)]"
            >
              Выберите шаблон приглашения
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-[var(--color-steppe)]"
            >
              Тёплые и уютные шаблоны для важного семейного торжества
            </motion.p>
          </motion.div>

          {isLoading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <div className="h-48 animate-shimmer rounded-t-2xl bg-[var(--color-steppe-15)]" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 animate-shimmer rounded bg-[var(--color-steppe-15)]" />
                      <div className="h-3 w-1/2 animate-shimmer rounded bg-[var(--color-steppe-15)]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <Card className="mt-12">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <SealSvg size={64} className="mb-4 text-[var(--color-steppe-25)]" />
                <p className="text-[var(--color-steppe)]">
                  Шаблоны скоро появятся
                </p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {templates.map((tpl) => (
                <motion.div key={tpl.id} variants={fadeUp}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <div className="relative h-48 bg-[var(--color-ink)] flex items-center justify-center overflow-hidden rounded-t-2xl">
                      {tpl.thumbnailUrl ? (
                        <img
                          src={tpl.thumbnailUrl}
                          alt={tpl.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <SealSvg size={64} className="text-[var(--color-gold)] opacity-30" />
                      )}
                      {tpl.isPremium && (
                        <Badge variant="premium" className="absolute left-3 top-3">
                          <Crown className="mr-1 h-3 w-3" /> Premium
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[var(--color-ink)]">
                        {tpl.name}
                      </h3>
                      {tpl.priceKzt > 0 && (
                        <p className="mt-1 text-sm font-medium text-[var(--color-gold)]">
                          {tpl.priceKzt.toLocaleString()} ₸
                        </p>
                      )}
                      <Button
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => handleUseTemplate(tpl.id)}
                        isLoading={cloneTemplate.isPending}
                      >
                        <Gift className="mr-1.5 h-4 w-4" />
                        Использовать
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-ink)] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-6 flex justify-center">
              <SealSvg size={48} className="text-[var(--color-gold)]" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-[var(--text-display-lg)] text-[var(--color-parchment)]"
            >
              Готовы создать приглашение?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-[var(--color-steppe)]"
            >
              Выберите шаблон выше и создайте тёплое приглашение для вашего сүндет той
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Button
                size="xl"
                className="group"
                onClick={() => templates.length > 0 && handleUseTemplate(templates[0].id)}
              >
                Начать <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
