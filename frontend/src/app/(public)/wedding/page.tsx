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
import { Crown, ArrowRight, Heart, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function WeddingPage() {
  const router = useRouter();
  const { data: templates = [], isLoading } = useTemplates("wedding");
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

      {/* Hero — soft floral pink-gold gradients */}
      <CategoryHero
        title="Той шақыру"
        subtitle="Создайте элегантное цифровое приглашение для вашей свадьбы. Красивые шаблоны с традиционными казахскими мотивами и современным дизайном."
        gradientFrom="#8B2252"
        gradientTo="#D4A574"
      >
        {/* Floral / petal decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Soft petal shapes */}
          <div
            className="absolute left-[10%] top-[15%] h-32 w-32 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #FFB6C1, transparent)" }}
          />
          <div
            className="absolute right-[15%] top-[25%] h-48 w-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #FFD700, transparent)" }}
          />
          <div
            className="absolute bottom-[10%] left-[20%] h-40 w-40 rounded-full opacity-8"
            style={{ background: "radial-gradient(circle, #FFC0CB, transparent)" }}
          />
          {/* Gold sparkle dots */}
          <div className="absolute left-[30%] top-[10%] h-2 w-2 rounded-full bg-white/20" />
          <div className="absolute right-[25%] top-[40%] h-1.5 w-1.5 rounded-full bg-white/25" />
          <div className="absolute left-[45%] bottom-[20%] h-2 w-2 rounded-full bg-white/15" />
          <div className="absolute right-[40%] top-[15%] h-1 w-1 rounded-full bg-white/20" />
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
              Шаблоны для свадьбы
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
              Каждый шаблон можно настроить под ваш стиль — добавьте фото, текст и детали торжества
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
                        <Heart className="mr-1.5 h-4 w-4" />
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
              Выберите шаблон выше и начните создавать идеальное приглашение для вашего торжества
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
