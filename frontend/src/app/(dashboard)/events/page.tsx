"use client";

import Link from "next/link";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { SealSvg } from "@/shared/ui/seal-svg";
import { useEvents, useDeleteEvent } from "@/shared/lib/queries";
import { Plus, Calendar, ExternalLink, Trash2 } from "lucide-react";

export default function EventsPage() {
  const { t } = useI18n();
  const { data: events = [], isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[var(--text-display-md)] font-semibold text-[var(--color-ink)]">{t("nav.events") || "Мероприятия"}</h1>
          <p className="mt-1 text-[var(--color-steppe)]">Управляйте вашими событиями</p>
        </div>
        <Link href="/templates"><Button><Plus className="mr-2 h-4 w-4" /> Создать</Button></Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-6"><div className="space-y-3"><div className="h-4 w-3/4 animate-shimmer rounded-lg bg-[var(--color-steppe-15)]" /><div className="h-3 w-1/2 animate-shimmer rounded-lg bg-[var(--color-steppe-15)]" /></div></CardContent></Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <SealSvg size={64} className="mb-4 text-[var(--color-steppe-25)]" />
            <p className="text-[var(--color-steppe)]">Пока нет мероприятий</p>
            <Link href="/templates" className="mt-4"><Button variant="outline" size="sm">Выбрать шаблон</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-ink)]">{event.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-steppe)]">{event.eventType}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant={event.status === "published" ? "published" : "draft"}>
                        {event.status === "published" ? "Опубликовано" : "Черновик"}
                      </Badge>
                    </div>
                    <p className="mt-2 font-mono text-xs text-[var(--color-steppe)]">
                      {new Date(event.eventDate).toLocaleDateString("ru", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {event.status === "published" && (
                      <Link href={`/i/${event.slug}`} target="_blank" className="rounded-lg p-1.5 text-[var(--color-steppe)] hover:bg-[var(--color-gold-8)] hover:text-[var(--color-gold)]">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <button onClick={() => deleteEvent.mutate(event.id)} className="rounded-lg p-1.5 text-[var(--color-steppe)] hover:bg-[var(--color-wine-10)] hover:text-[var(--color-wine)]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
