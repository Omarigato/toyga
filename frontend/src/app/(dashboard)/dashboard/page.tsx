"use client";

import Link from "next/link";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { SealSvg } from "@/shared/ui/seal-svg";
import { useEvents, useTemplates, useGuests } from "@/shared/lib/queries";
import { Calendar, Sparkles, Users, ArrowRight, Plus } from "lucide-react";

export default function DashboardPage() {
  const { t } = useI18n();
  const { data: events = [] } = useEvents();
  const { data: templates = [] } = useTemplates();

  const stats = [
    { label: t("nav.events") || "Мероприятия", value: events.length, icon: Calendar, color: "gold" as const },
    { label: t("nav.templates") || "Шаблоны", value: templates.length, icon: Sparkles, color: "tengri" as const },
    { label: "Гости", value: 0, icon: Users, color: "wine" as const },
  ];

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[var(--text-display-md)] font-semibold text-[var(--color-ink)]">{t("nav.dashboard") || "Главная"}</h1>
        <p className="mt-1 text-[var(--color-steppe)]">Управляйте вашими приглашениями</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-steppe)]">{s.label}</p>
                  <p className="mt-2 font-mono text-[var(--text-display-lg)] font-semibold text-[var(--color-ink)]">{s.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-gold-20)] bg-[var(--color-gold-8)]">
                  <s.icon className="h-5 w-5 text-[var(--color-gold)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick action */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-ink)]">Создать приглашение</h3>
              <p className="mt-1 text-sm text-[var(--color-steppe)]">Выберите шаблон и создайте новое мероприятие</p>
            </div>
            <Link href="/events">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Новое
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Последние мероприятия</h2>
          <Link href="/events" className="text-sm font-medium text-[var(--color-tengri)] hover:underline">
            Все →
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <SealSvg size={64} className="mb-4 text-[var(--color-steppe-25)]" />
              <p className="text-[var(--color-steppe)]">Пока нет мероприятий</p>
              <Link href="/events" className="mt-4">
                <Button variant="outline" size="sm">Создать первое</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium text-[var(--color-ink)]">{event.title}</h3>
                    <p className="text-sm text-[var(--color-steppe)]">{event.eventType} · {new Date(event.eventDate).toLocaleDateString("ru")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      event.status === "published" ? "bg-[var(--color-tengri)] text-[var(--color-parchment)]" : "border border-[var(--color-steppe)] text-[var(--color-steppe)]"
                    }`}>
                      {event.status === "published" ? "Опубликовано" : "Черновик"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
