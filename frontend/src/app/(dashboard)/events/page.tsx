"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/shared/i18n/provider";
import { useEvents, useDeleteEvent } from "@/shared/lib/queries";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { SealSvg } from "@/shared/ui/seal-svg";
import { motion } from "framer-motion";
import { Plus, Calendar, ExternalLink, Trash2, MapPin, Users } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

export default function EventsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: events = [], isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Мои мероприятия</h1>
          <p className="mt-1 text-sm text-[var(--color-steppe)]">Управляйте вашими приглашениями</p>
        </div>
        <Link href="/templates">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Новое мероприятие</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-shimmer rounded-2xl bg-[var(--color-ink-5)]" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-[var(--color-gold-8)] p-4">
              <Calendar className="h-8 w-8 text-[var(--color-gold)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--color-ink)]">Нет мероприятий</h3>
            <p className="mt-1 text-sm text-[var(--color-steppe)]">Создайте первое приглашение для вашего торжества</p>
            <Link href="/templates" className="mt-4">
              <Button><Plus className="mr-2 h-4 w-4" /> Создать</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <motion.div key={event.id} variants={fadeUp}>
              <Card
                className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <div className="relative h-32 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[var(--color-gold-8)] to-[var(--color-ink-5)]">
                  {event.template?.thumbnailUrl ? (
                    <img src={event.template.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <SealSvg size={40} className="text-[var(--color-ink-12)]" />
                    </div>
                  )}
                  <div className="absolute right-3 top-3">
                    <Badge variant={event.status === "published" ? "default" : "secondary"}>
                      {event.status === "published" ? "Опубликовано" : "Черновик"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-[var(--color-ink)] truncate">{event.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-steppe)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.eventDate).toLocaleDateString("ru", { day: "numeric", month: "short" })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                    {event._count?.guests !== undefined && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event._count.guests}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {event.status === "published" && (
                      <Link
                        href={`/i/${event.slug}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-gold)] hover:bg-[var(--color-gold-8)]"
                      >
                        Открыть
                      </Link>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Удалить мероприятие?")) deleteEvent.mutate(event.id);
                      }}
                      className="ml-auto rounded-lg p-1 text-[var(--color-steppe)] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--color-wine-8)] hover:text-[var(--color-wine)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
