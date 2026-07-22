"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/widgets/dashboard-sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QRCodeCard } from "@/components/ui/qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Calendar, Users, ExternalLink, QrCode, Share2, Edit3, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [selectedQrUrl, setSelectedQrUrl] = useState<string | null>(null);

  const userEvents = [
    {
      id: "ev1",
      title: "Омар & Маржан Үйлену Тойы",
      type: "Үйлену той",
      date: "25 Тамыз 2026",
      status: "published",
      statusText: "Жарияланған",
      isPaid: true,
      guestsCount: 142,
      slug: "omar-marzhan",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-row font-sans">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gold">Мои мероприятия</h1>
            <p className="text-sm text-white/60 mt-1">
              Барлық жасалған той-шақыруларыңыз мен қонақтар статистикасы
            </p>
          </div>

          <Link href="/wizard">
            <Button variant="primary" size="lg" className="shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Жаңа шақыру жасау
            </Button>
          </Link>
        </div>

        {/* User Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {userEvents.map((ev) => {
            const publicUrl = `https://toyga.kz/i/${ev.slug}/demo`;

            return (
              <Card key={ev.id} hoverGlow className="p-6 border-gold/30 space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant="teal">{ev.statusText}</Badge>
                  <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                    {ev.type}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-serif font-bold text-white">{ev.title}</h3>
                  <p className="text-xs text-white/50">ID: {ev.id} · Тариф: Премиум</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-white/80 bg-[#1A1A2E] p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gold" />
                    <span>{ev.guestsCount} қонақ тіркелді</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                  <Link href={`/crm/${ev.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      <Users className="w-4 h-4 mr-1 text-gold" /> Қонақтар CRM
                    </Button>
                  </Link>

                  <Link href="/editor" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Edit3 className="w-4 h-4 mr-1" /> Редактор
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedQrUrl(publicUrl)}
                    title="QR код"
                  >
                    <QrCode className="w-4 h-4 text-gold" />
                  </Button>

                  <Link href={`/i/${ev.slug}/erzhan`} target="_blank">
                    <Button variant="primary" size="sm" className="text-xs">
                      <ExternalLink className="w-4 h-4 mr-1" /> Көру
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* QR Code Dialog */}
      <Dialog open={!!selectedQrUrl} onOpenChange={() => setSelectedQrUrl(null)}>
        <DialogContent className="bg-[#1A1A2E] border-gold/40 max-w-sm">
          <DialogHeader>
            <DialogTitle>Шақыру QR коды</DialogTitle>
            <DialogDescription>
              QR кодты сканерлеп немесе WhatsApp арқылы шақыру сілтемесін бөлісіңіз
            </DialogDescription>
          </DialogHeader>

          {selectedQrUrl && (
            <div className="py-4 flex flex-col items-center space-y-4">
              <QRCodeCard value={selectedQrUrl} size={200} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(selectedQrUrl);
                  alert("Сілтеме көшірілді!");
                }}
                className="w-full text-xs"
              >
                <Share2 className="w-4 h-4 mr-2" /> Сілтемені көшіру
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
