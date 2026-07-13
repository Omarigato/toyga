"use client";

import * as React from "react";
import Link from "next/link";
import { useEvents, useCreateEvent, useDeleteEvent, useTemplates } from "@/shared/lib/queries";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { Skeleton } from "@/shared/ui/skeleton";
import { Select } from "@/shared/ui/select";
import { useToast } from "@/shared/ui/toast";
import { formatDate } from "@/shared/lib/utils";
import { EVENT_TYPES } from "@/shared/constants";
import type { EventType } from "@/shared/types";
import { Plus, Search, Calendar, MapPin, Users, Trash2, Edit, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function EventsPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const { data: events, isLoading } = useEvents();
  const { data: templates } = useTemplates();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const [search, setSearch] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", templateId: "", eventType: "wedding" as EventType, eventDate: "", location: "" });

  const filtered = events?.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase())) || [];

  async function handleCreate() {
    try {
      await createEvent.mutateAsync({ ...form, eventDate: new Date(form.eventDate).toISOString() });
      toast("success", t("events.createModal"));
      setCreateOpen(false);
      setForm({ title: "", templateId: "", eventType: "wedding", eventDate: "", location: "" });
    } catch { toast("error", t("common.error")); }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("events.deleteConfirm"))) return;
    try { await deleteEvent.mutateAsync(id); toast("success", t("events.delete")); } catch { toast("error", t("common.error")); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">{t("events.title")}</h1><p className="text-sm text-stone-500">{t("events.subtitle")}</p></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> {t("events.create")}</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><Input placeholder={t("events.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Card key={i}><CardContent className="p-5"><Skeleton className="mb-3 h-32 w-full rounded-xl" /><Skeleton className="mb-2 h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center"><Calendar className="mx-auto h-12 w-12 text-stone-300" /><p className="mt-4 text-lg font-medium">{t("events.noEvents")}</p><Button className="mt-6" onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> {t("events.create")}</Button></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-amber-500/5">
                <div className="relative h-40 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/30 dark:to-stone-900">
                  {event.template?.thumbnailUrl ? <img src={event.template.thumbnailUrl} alt={event.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><Calendar className="h-12 w-12 text-amber-300" /></div>}
                  <div className="absolute right-2 top-2"><Badge variant={event.status === "published" ? "success" : "secondary"}>{event.status === "published" ? t("events.published") : t("events.draft")}</Badge></div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-sm text-stone-500">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(event.eventDate, locale)}</div>
                    {event.location && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.location}</div>}
                    <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {event._count?.guests || 0} {t("events.guests")}</div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/events/${event.id}/editor`} className="flex-1"><Button variant="outline" size="sm" className="w-full"><Edit className="mr-1 h-3.5 w-3.5" /> {t("events.edit")}</Button></Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(event.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t("events.createModal")} size="lg">
        <div className="space-y-4">
          <Input label={t("events.name")} placeholder="Omar & Marjan" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label={t("events.type")} value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value as EventType })} options={Object.entries(EVENT_TYPES).map(([v, k]) => ({ value: v, label: t(k) }))} />
          <Input label={t("events.date")} type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
          <Input label={t("events.location")} placeholder="Restaurant Bishkek" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Select label={t("events.template")} value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })} placeholder={t("events.selectTemplate")} options={templates?.map((t) => ({ value: t.id, label: t.name })) || []} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>{t("events.cancel")}</Button>
            <Button onClick={handleCreate} isLoading={createEvent.isPending} disabled={!form.title || !form.eventDate}>{t("common.create")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
