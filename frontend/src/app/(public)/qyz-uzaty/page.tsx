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
import { Crown, ArrowRight, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function QyzUzatyPage() {
  const router = useRouter();
  const { data: templates = [], isLoading } = useTemplates("kyz-uzatu");
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

      {/* Hero — elegant teal-gold traditional Kazakh patterns */}
      <CategoryHero
        title="Қыз ұзату"
        subtitle="Традиционное приглашение на проводы дочери. Изысканные казахские орнаменты и золотые мотивы для особенного дня."
        gradientFrom="#1A3C40"
        gradientTo="#B8902E"
      >
        {/* Kazakh ornamental decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Ornamental corner patterns — stylized qoshqar-muiz */}
          <svg
            className="absolute left-4 top-4 h-24 w-24 text-white/10 sm:h-32 sm:w-32"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M10 90 C10 50, 50 10, 90 10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 70 C10 40, 40 10, 70 10"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M20 90 C20 55, 55 20, 90 20"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            {/* Ram's horn spiral */}
            <path
              d="M10 90 C5 80, 5 70, 15 65 C25 60, 20 50, 15 55"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>

          <svg
            className="absolute bottom-4 right-4 h-24 w-24 rotate-180 text-white/10 sm:h-32 sm:w-32"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M10 90 C10 50, 50 10, 90 10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 70 C10 40, 40 10, 70 10"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M20 90 C20 55, 55 20, 90 20"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path
              d="M10 90 C5 80, 5 70, 15 65 C25 60, 20 50, 15 55"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>

          {/* Geometric pattern dots */}
          <div className="absolute left-1/4 top-[20%] grid grid-cols-3 gap-2 opacity-10">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
            ))}
          </div>
          <div className="absolute bottom-[25%] right-[20%] grid grid-cols-3 gap-2 opacity-10">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
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
              Шаблоны для қыз ұзату
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
              Каждый шаблон вдохновлён традиционными казахскими орнаментами и культурой
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
                        <Star className="mr-1.5 h-4 w-4" />
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
              Выберите шаблон выше и начните создавать идеальное приглашение для проводов дочери
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
