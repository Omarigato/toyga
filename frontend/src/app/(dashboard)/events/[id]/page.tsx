"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/shared/i18n/provider";
import { useEvent, useGuests, useDeleteGuest, useCreateGuest, useUpdateGuest } from "@/shared/lib/queries";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { SealSvg } from "@/shared/ui/seal-svg";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Palette, Users, Plus, Edit, Trash2, ExternalLink,
  MessageCircle, Phone, Mail, UserCheck, UserX, UserPlus, Download,
  ToggleLeft, ToggleRight, Send, CheckCircle2, XCircle, Clock, HelpCircle
} from "lucide-react";

type TabKey = "template" | "guests";

interface GuestFormData {
  name: string;
  phone: string;
  email: string;
  customMessage: string;
}

const emptyGuest: GuestFormData = { name: "", phone: "", email: "", customMessage: "" };

const rsvpOptions: Array<{ value: string; label: string; icon: any; color: string }> = [
  { value: "confirmed", label: "Приду", icon: CheckCircle2, color: "text-emerald-600" },
  { value: "declined", label: "Не приду", icon: XCircle, color: "text-red-500" },
  { value: "maybe", label: "С парой", icon: HelpCircle, color: "text-amber-600" },
];

const rsvpStatusMap: Record<string, { value: string; label: string; icon: any; color: string }> = {
  confirmed: rsvpOptions[0],
  declined: rsvpOptions[1],
  maybe: rsvpOptions[2],
  pending: { value: "pending", label: "Ожидание", icon: Clock, color: "text-stone-400" },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const eventId = params.id as string;

  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: guests = [], isLoading: guestsLoading } = useGuests(eventId);
  const deleteGuest = useDeleteGuest();
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();

  const [activeTab, setActiveTab] = React.useState<TabKey>("template");
  const [showGuestModal, setShowGuestModal] = React.useState(false);
  const [editingGuest, setEditingGuest] = React.useState<any>(null);
  const [formData, setFormData] = React.useState<GuestFormData>(emptyGuest);
  const [autoSend, setAutoSend] = React.useState(false);

  const handleOpenAddGuest = () => {
    setEditingGuest(null);
    setFormData(emptyGuest);
    setShowGuestModal(true);
  };

  const handleOpenEditGuest = (guest: any) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name || "",
      phone: guest.phone || "",
      email: guest.email || "",
      customMessage: guest.customMessage || "",
    });
    setShowGuestModal(true);
  };

  const handleSaveGuest = async () => {
    if (!formData.name.trim()) return;
    try {
      if (editingGuest) {
        await updateGuest.mutateAsync({ id: editingGuest.id, data: formData });
      } else {
        await createGuest.mutateAsync({ eventId, ...formData });
      }
      setShowGuestModal(false);
      setFormData(emptyGuest);
    } catch (err) {
      console.error("Failed to save guest:", err);
    }
  };

  const handleDeleteGuest = (guestId: string) => {
    if (confirm("Удалить гостя?")) {
      deleteGuest.mutate(guestId);
    }
  };

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <SealSvg size={48} className="text-[var(--color-gold)] animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[var(--color-steppe)]">Мероприятие не найдено</p>
        <Link href="/events"><Button variant="ghost" className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" /> Назад</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/events")} className="mb-2 -ml-2 gap-1">
            <ArrowLeft className="h-4 w-4" /> Мои мероприятия
          </Button>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)]">{event.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Badge variant={event.status === "published" ? "default" : "secondary"}>
              {event.status === "published" ? "Опубликовано" : "Черновик"}
            </Badge>
            <span className="text-sm text-[var(--color-steppe)]">
              {new Date(event.eventDate).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {event.status === "published" && (
            <Link href={`/i/${event.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1"><ExternalLink className="h-4 w-4" /> Открыть</Button>
            </Link>
          )}
          <Link href={`/events/${eventId}/editor`}>
            <Button size="sm" className="gap-1"><Palette className="h-4 w-4" /> Редактировать</Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-[var(--color-ink-5)] p-1">
        {([
          { key: "template" as TabKey, label: "Шаблон", icon: Palette },
          { key: "guests" as TabKey, label: `Гости (${guests.length})`, icon: Users },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[var(--color-white)] text-[var(--color-ink)] shadow-sm"
                : "text-[var(--color-steppe)] hover:text-[var(--color-ink)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "template" && (
          <motion.div
            key="template"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
                  {/* Template Preview */}
                  <div className="w-full max-w-[280px] shrink-0">
                    <div className="relative overflow-hidden rounded-2xl bg-[var(--color-ink-5)] shadow-lg" style={{ aspectRatio: "9/16" }}>
                      {event.template?.thumbnailUrl ? (
                        <img src={event.template.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <SealSvg size={64} className="text-[var(--color-ink-12)]" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Template Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-ink)]">{event.template?.name || "Шаблон"}</h3>
                      <p className="mt-1 text-sm text-[var(--color-steppe)]">Клон шаблона, привязанный к этому мероприятию</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/events/${eventId}/editor`}>
                        <Button className="gap-2"><Palette className="h-4 w-4" /> Открыть редактор</Button>
                      </Link>
                      {event.status === "published" && (
                        <Link href={`/i/${event.slug}`} target="_blank">
                          <Button variant="outline" className="gap-2"><ExternalLink className="h-4 w-4" /> Открыть приглашение</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "guests" && (
          <motion.div
            key="guests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between border-b border-[var(--color-ink-5)] px-6 py-4">
                  <h3 className="font-medium text-[var(--color-ink)]">Список гостей ({guests.length})</h3>
                  <div className="flex items-center gap-3">
                    {/* Auto-send toggle */}
                    <button
                      onClick={() => setAutoSend(!autoSend)}
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[var(--color-steppe)] hover:bg-[var(--color-ink-5)]"
                    >
                      {autoSend ? <ToggleRight className="h-5 w-5 text-[var(--color-success)]" /> : <ToggleLeft className="h-5 w-5" />}
                      <span>Автоотправка</span>
                    </button>
                    <Button size="sm" className="gap-1" onClick={handleOpenAddGuest}>
                      <Plus className="h-4 w-4" /> Добавить
                    </Button>
                  </div>
                </div>

                {/* Table */}
                {guestsLoading ? (
                  <div className="space-y-3 p-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 animate-shimmer rounded-lg bg-[var(--color-ink-5)]" />
                    ))}
                  </div>
                ) : guests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="h-10 w-10 text-[var(--color-ink-12)]" />
                    <p className="mt-3 text-sm text-[var(--color-steppe)]">Пока нет гостей</p>
                    <Button size="sm" variant="ghost" className="mt-2 gap-1" onClick={handleOpenAddGuest}>
                      <Plus className="h-4 w-4" /> Добавить первого гостя
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--color-ink-5)] text-left text-xs font-medium uppercase tracking-wider text-[var(--color-steppe)]">
                          <th className="px-6 py-3">Имя</th>
                          <th className="px-6 py-3">Телефон</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">RSVP</th>
                          {autoSend && <th className="px-6 py-3">Отправка</th>}
                          <th className="px-6 py-3 text-right">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-ink-5)]">
                        {guests.map((guest) => {
                          const rsvp = rsvpStatusMap[guest.rsvpStatus] || rsvpStatusMap.pending;
                          return (
                            <tr key={guest.id} className="group hover:bg-[var(--color-ink-5)]/50">
                              <td className="px-6 py-3">
                                <span className="font-medium text-[var(--color-ink)]">{guest.name}</span>
                                {guest.customMessage && (
                                  <p className="mt-0.5 text-xs text-[var(--color-steppe)] truncate max-w-[200px]">{guest.customMessage}</p>
                                )}
                              </td>
                              <td className="px-6 py-3 text-[var(--color-steppe)]">
                                {guest.phone ? (
                                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {guest.phone}</span>
                                ) : "—"}
                              </td>
                              <td className="px-6 py-3 text-[var(--color-steppe)]">
                                {guest.email ? (
                                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {guest.email}</span>
                                ) : "—"}
                              </td>
                              <td className="px-6 py-3">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${rsvp.color} bg-[var(--color-ink-5)]`}>
                                  <rsvp.icon className="h-3 w-3" />
                                  {rsvp.label}
                                </span>
                              </td>
                              {autoSend && (
                                <td className="px-6 py-3">
                                  <span className="inline-flex items-center gap-1 text-xs text-[var(--color-steppe)]">
                                    <Send className="h-3 w-3" /> {guest.whatsappStatus || "Ожидание"}
                                  </span>
                                </td>
                              )}
                              <td className="px-6 py-3 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                  <button onClick={() => handleOpenEditGuest(guest)} className="rounded-lg p-1.5 text-[var(--color-steppe)] hover:bg-[var(--color-ink-5)] hover:text-[var(--color-ink)]">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => handleDeleteGuest(guest.id)} className="rounded-lg p-1.5 text-[var(--color-steppe)] hover:bg-[var(--color-wine-8)] hover:text-[var(--color-wine)]">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest Modal */}
      <Modal
        open={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title={editingGuest ? "Редактировать гостя" : "Добавить гостя"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Имя *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Азамат"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Телефон"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (900) 123-45-67"
            />
            <Input
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="guest@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--color-steppe)]">Персональное сообщение</label>
            <textarea
              value={formData.customMessage}
              onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              placeholder="Дорогой Азамат, приглашаем вас на наше торжество..."
              className="w-full rounded-xl border border-[var(--color-ink-8)] bg-[var(--color-white)] p-3 text-sm focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowGuestModal(false)}>Отмена</Button>
            <Button onClick={handleSaveGuest} isLoading={createGuest.isPending || updateGuest.isPending}>
              {editingGuest ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
