"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/widgets/dashboard-sidebar";
import { DataTable } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Users, Download, Share2, Plus, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react";

interface GuestRecord {
  id: string;
  name: string;
  phone: string;
  status: "accepted" | "declined" | "pending";
  count: number;
  group: string;
  comment: string;
  slug: string;
}

export default function GuestCRMPage() {
  const [filter, setFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestGroup, setNewGuestGroup] = useState("Құдалар");

  const [guests, setGuests] = useState<GuestRecord[]>([
    {
      id: "1",
      name: "Ержан Асан",
      phone: "+7 701 123 45 67",
      status: "accepted",
      count: 2,
      group: "Құдалар",
      comment: "Құтты болсын! Жұбайыммен келемін",
      slug: "erzhan",
    },
    {
      id: "2",
      name: "Серік Айтбаев",
      phone: "+7 702 987 65 43",
      status: "declined",
      count: 0,
      group: "Достар",
      comment: "Өкінішке орай басқа қалада боламын",
      slug: "serik",
    },
    {
      id: "3",
      name: "Айгүл Батырбекова",
      phone: "+7 705 555 44 33",
      status: "pending",
      count: 1,
      group: "Әріптестер",
      comment: "-",
      slug: "aigul",
    },
  ]);

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGuestName) {
      const newGuest: GuestRecord = {
        id: String(Date.now()),
        name: newGuestName,
        phone: newGuestPhone || "-",
        status: "pending",
        count: 1,
        group: newGuestGroup,
        comment: "-",
        slug: newGuestName.toLowerCase().replace(/\s+/g, "-"),
      };
      setGuests([...guests, newGuest]);
      setNewGuestName("");
      setNewGuestPhone("");
      setAddDialogOpen(false);
    }
  };

  const handleExportExcel = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Аты,Телефон,Статус,Адам саны,Топ,Тілек"]
        .concat(
          guests.map(
            (g) =>
              `"${g.name}","${g.phone}","${g.status}",${g.count},"${g.group}","${g.comment}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "toyga_guests_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<GuestRecord>[] = [
    {
      accessorKey: "name",
      header: "Қонақ аты-жөні",
      cell: ({ row }) => (
        <div className="font-semibold text-white">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "group",
      header: "Топ (Группа)",
      cell: ({ row }) => <Badge variant="gold">{row.original.group}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const st = row.original.status;
        if (st === "accepted") {
          return (
            <span className="inline-flex items-center space-x-1 text-teal-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> <span>Иә, барады</span>
            </span>
          );
        }
        if (st === "declined") {
          return (
            <span className="inline-flex items-center space-x-1 text-rose-300 text-xs font-bold">
              <XCircle className="w-4 h-4" /> <span>Бара алмайды</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center space-x-1 text-gold text-xs font-bold">
            <Clock className="w-4 h-4" /> <span>Күтілуде</span>
          </span>
        );
      },
    },
    {
      accessorKey: "count",
      header: "Адам саны",
      cell: ({ row }) => (
        <span className="font-bold text-white">{row.original.count} адам</span>
      ),
    },
    {
      accessorKey: "comment",
      header: "Пікір / Тілек",
      cell: ({ row }) => (
        <span className="text-xs text-white/60 max-w-xs truncate block">
          {row.original.comment}
        </span>
      ),
    },
    {
      id: "actions",
      header: "WhatsApp сілтеме",
      cell: ({ row }) => {
        const inviteUrl = `https://toyga.kz/i/omar-marzhan/${row.original.slug}`;
        const waText = encodeURIComponent(
          `Сәлеметсіз бе, ${row.original.name}! Сізді тойымызға арнайы шақырамыз: ${inviteUrl}`
        );

        return (
          <a
            href={`https://wa.me/?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="h-8 text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10">
              <MessageSquare className="w-3.5 h-3.5 mr-1" /> WhatsApp
            </Button>
          </a>
        );
      },
    },
  ];

  const filteredGuests =
    filter === "all"
      ? guests
      : guests.filter((g) => g.status === filter);

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-row font-sans">
      <DashboardSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gold">
              Қонақтарды басқару (CRM)
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Омар & Маржан Үйлену Тойы — RSVP жауаптары мен тізім
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Қонақ қосу
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleExportExcel}
              className="shadow-md"
            >
              <Download className="w-4 h-4 mr-1" /> Excel экспорт
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {[
            { id: "all", label: "Барлығы" },
            { id: "accepted", label: "Иә, барады" },
            { id: "declined", label: "Бара алмайды" },
            { id: "pending", label: "Күтілуде" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilter(st.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                filter === st.id
                  ? "bg-gradient-to-r from-gold to-[#A68B4B] text-ink border-gold font-bold shadow-md"
                  : "bg-[#252542] text-white/70 border-white/10 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <DataTable columns={columns} data={filteredGuests} searchKey="name" />
      </main>

      {/* Add Guest Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-[#1A1A2E] border-gold/40">
          <DialogHeader>
            <DialogTitle>Жаңа қонақ қосу</DialogTitle>
            <DialogDescription>
              Қонақтың аты-жөнін енгізіңіз. Оған жеке шақыру сілтемесі автоматикалық генерацияланады.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddGuest} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs text-white/70">Қонақ аты-жөні:</label>
              <Input
                required
                placeholder="Мысалы: Бауыржан мырза"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70">Телефон нөмірі (міндетті емес):</label>
              <Input
                placeholder="+7 (701) 000-00-00"
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70">Топ / Категория:</label>
              <Input
                placeholder="Құдалар / Достар / Әріптестер"
                value={newGuestGroup}
                onChange={(e) => setNewGuestGroup(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Қосу
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
