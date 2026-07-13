"use client";

import Link from "next/link";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { SealSvg } from "@/shared/ui/seal-svg";
import { useTemplates } from "@/shared/lib/queries";
import { Sparkles, Crown } from "lucide-react";

export default function TemplatesPage() {
  const { t } = useI18n();
  const { data: templates = [], isLoading } = useTemplates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--text-display-md)] font-semibold text-[var(--color-ink)]">{t("nav.templates") || "Шаблоны"}</h1>
        <p className="mt-1 text-[var(--color-steppe)]">Выберите шаблон для вашего приглашения</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}><CardContent className="p-0"><div className="h-48 animate-shimmer rounded-t-2xl bg-[var(--color-steppe-15)]" /><div className="p-4 space-y-2"><div className="h-4 w-3/4 animate-shimmer rounded bg-[var(--color-steppe-15)]" /><div className="h-3 w-1/2 animate-shimmer rounded bg-[var(--color-steppe-15)]" /></div></CardContent></Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <SealSvg size={64} className="mb-4 text-[var(--color-steppe-25)]" />
            <p className="text-[var(--color-steppe)]">Шаблоны скоро появятся</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Link key={tpl.id} href={`/events?template=${tpl.id}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                {/* Template preview — full bleed top */}
                <div className="relative h-48 bg-[var(--color-ink)] flex items-center justify-center overflow-hidden rounded-t-2xl">
                  {tpl.thumbnailUrl ? (
                    <img src={tpl.thumbnailUrl} alt={tpl.name} className="h-full w-full object-cover" />
                  ) : (
                    <SealSvg size={64} className="text-[var(--color-gold)] opacity-30" />
                  )}
                  {tpl.isPremium && (
                    <Badge variant="premium" className="absolute left-3 top-3">
                      <Crown className="mr-1 h-3 w-3" /> Premium
                    </Badge>
                  )}
                </div>
                {/* Template info — paper background */}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-[var(--color-ink)]">{tpl.name}</h3>
                  {tpl.category && (
                    <p className="mt-1 font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-steppe)]">{tpl.category.name}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
