"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Users, CheckCircle2, XCircle, Clock, Download, Share2, Plus, MessageSquare } from "lucide-react";

export default function GuestCRMPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>("all");

  const mockGuests = [
    { id: "1", name: "Ержан Асан", phone: "+7 701 123 45 67", status: "accepted", count: 2, group: "Құдалар", comment: "Құтты болсын! Жұбайыммен келемін", slug: "erzhan" },
    { id: "2", name: "Серік Айтбаев", phone: "+7 702 987 65 43", status: "declined", count: 0, group: "Достар", comment: "Өкінішке орай басқа қалада боламын", slug: "serik" },
    { id: "3", name: "Айгүл Батырбекова", phone: "+7 705 555 44 33", status: "pending", count: 1, group: "Әріптестер", comment: "-", slug: "aigul" }
  ];

  const filteredGuests = filter === "all" ? mockGuests : mockGuests.filter(g => g.status === filter);

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Қонақтарды басқару (CRM)</h1>
            <p className="text-sm text-gray-400 mt-1">Омар & Маржан Үйлену Тойы — RSVP жауаптарын бақылау</p>
          </div>

          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all">
            <Download className="w-4 h-4" />
            <span>Excel жүктеп алу</span>
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {["all", "accepted", "declined", "pending"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                filter === st
                  ? "bg-amber-500 text-black border-amber-400 shadow-md"
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              {st === "all" ? "Барлығы" : st === "accepted" ? "Иә, барады" : st === "declined" ? "Бара алмайды" : "Күтілуде"}
            </button>
          ))}
        </div>

        {/* Guests Data Table */}
        <div className="bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs text-amber-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">Қонақ аты-жөні</th>
                  <th className="p-4">Топ (Группа)</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Адам саны</th>
                  <th className="p-4">Пікір / Тілек</th>
                  <th className="p-4 text-right">Жеке сілтеме</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{guest.name}</td>
                    <td className="p-4"><span className="px-2.5 py-1 rounded-md bg-white/10 text-xs">{guest.group}</span></td>
                    <td className="p-4">
                      {guest.status === "accepted" && (
                        <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" /> <span>Иә, барады</span>
                        </span>
                      )}
                      {guest.status === "declined" && (
                        <span className="inline-flex items-center space-x-1 text-rose-400 text-xs font-bold">
                          <XCircle className="w-4 h-4" /> <span>Бара алмайды</span>
                        </span>
                      )}
                      {guest.status === "pending" && (
                        <span className="inline-flex items-center space-x-1 text-amber-400 text-xs font-bold">
                          <Clock className="w-4 h-4" /> <span>Күтілуде</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-white">{guest.count} адам</td>
                    <td className="p-4 text-xs text-gray-400 max-w-xs truncate">{guest.comment}</td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
