"use client";

import * as React from "react";
import { useEvents, useGuests, useCreateGuest, useDeleteGuest } from "@/shared/lib/queries";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { Skeleton } from "@/shared/ui/skeleton";
import { Avatar } from "@/shared/ui/avatar";
import { useToast } from "@/shared/ui/toast";
import { UserPlus, Phone, Mail, Link2, Check, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const statusKeys: Record<string, string> = {
  pending: "guests.status.pending", invited: "guests.status.invited", viewed: "guests.status.viewed",
  confirmed: "guests.status.confirmed", declined: "guests.status.declined", maybe: "guests.status.maybe",
};

export default function GuestsPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { data: events } = useEvents();
  const [selectedEvent, setSelectedEvent] = React.useState("");
  const { data: guests, isLoading } = useGuests(selectedEvent);
  const createGuest = useCreateGuest();
  const deleteGuest = useDeleteGuest();
  const [addOpen, setAddOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", phone: "", email: "", customMessage: "" });
  const [copiedSlug, setCopiedSlug] = React.useState<string | null>(null);

  React.useEffect(() => { if (events?.length && !selectedEvent) setSelectedEvent(events[0].id); }, [events, selectedEvent]);

  async function handleAdd() {
    try {
      await createGuest.mutateAsync({ eventId: selectedEvent, ...form });
      toast("success", t("guests.addModal"));
      setAddOpen(false);
      setForm({ name: "", phone: "", email: "", customMessage: "" });
    } catch { toast("error", t("common.error")); }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("events.deleteConfirm"))) return;
    try { await deleteGuest.mutateAsync(id); toast("success", t("events.delete")); } catch { toast("error", t("common.error")); }
  }

  function copyLink(slug: string) {
    navigator.clipboard.writeText(`${window.location.origin}/i/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
    toast("success", t("guests.copied"));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">{t("guests.title")}</h1><p className="text-sm text-stone-500">{t("guests.subtitle")}</p></div>
        {selectedEvent && <Button onClick={() => setAddOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> {t("guests.add")}</Button>}
      </div>
      {events?.length ? (
        <div><label className="mb-1.5 block text-sm font-medium">{t("guests.selectEvent")}</label>
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="flex h-11 w-full max-w-md rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-stone-800 dark:bg-stone-950">
            {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Card key={i}><CardContent className="flex items-center gap-4 p-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="flex-1"><Skeleton className="mb-1 h-4 w-32" /><Skeleton className="h-3 w-24" /></div></CardContent></Card>)}</div>
      ) : !guests?.length ? (
        <Card><CardContent className="py-16 text-center"><p className="mt-4 text-lg font-medium">{t("guests.noGuests")}</p><p className="mt-1 text-sm text-stone-500">{t("guests.noGuestsDesc")}</p><Button className="mt-6" onClick={() => setAddOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> {t("guests.addFirst")}</Button></CardContent></Card>
      ) : (
        <div className="space-y-2">
          {guests.map((guest, i) => (
            <motion.div key={guest.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <Card><CardContent className="flex items-center gap-4 p-4">
                <Avatar fallback={guest.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{guest.name}</p>
                  <div className="flex items-center gap-3 text-sm text-stone-500">
                    {guest.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {guest.phone}</span>}
                    {guest.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {guest.email}</span>}
                  </div>
                </div>
                <Badge className={guest.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : guest.status === "declined" ? "bg-red-100 text-red-800" : "bg-stone-100 text-stone-600"}>{t(statusKeys[guest.status] || "guests.status.pending")}</Badge>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyLink(guest.personalSlug)}>{copiedSlug === guest.personalSlug ? <Check className="h-4 w-4 text-emerald-500" /> : <Link2 className="h-4 w-4" />}</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(guest.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={t("guests.addModal")}>
        <div className="space-y-4">
          <Input label={t("guests.name")} placeholder="Aigerim" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label={t("guests.phone")} placeholder="+77001234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label={t("guests.email")} placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setAddOpen(false)}>{t("events.cancel")}</Button>
            <Button onClick={handleAdd} isLoading={createGuest.isPending} disabled={!form.name}>{t("guests.add")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
