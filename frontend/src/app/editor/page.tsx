"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dock } from "@/components/ui/dock";
import { Save, Type, Palette, Music, Image as ImageIcon, Layout, ArrowLeft, Sparkles, Check } from "lucide-react";

export default function CanvasEditorPage() {
  const { t } = useI18n();
  const [activeDock, setActiveDock] = useState<string>("text");
  const [saved, setSaved] = useState(false);
  const [canvasState, setCanvasState] = useState({
    title: "Омар & Маржан",
    subtitle: "Үйлену тойына арнайы шақыру",
    date: "25 Тамыз 2026",
    venue: "Altyn Shatyr Grand Ballroom",
    accentColor: "#C9A96E",
    fontFamily: "Playfair Display",
    musicTitle: "Үйлену той вальсі",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const dockItems = [
    {
      id: "text",
      label: "Мәтін",
      icon: <Type className="w-5 h-5" />,
      active: activeDock === "text",
      onClick: () => setActiveDock("text"),
    },
    {
      id: "color",
      label: "Түс пен Шрифт",
      icon: <Palette className="w-5 h-5" />,
      active: activeDock === "color",
      onClick: () => setActiveDock("color"),
    },
    {
      id: "music",
      label: "Музыка",
      icon: <Music className="w-5 h-5" />,
      active: activeDock === "music",
      onClick: () => setActiveDock("music"),
    },
    {
      id: "photo",
      label: "Галерея",
      icon: <ImageIcon className="w-5 h-5" />,
      active: activeDock === "photo",
      onClick: () => setActiveDock("photo"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col font-sans pb-24">
      <Navbar />

      {/* Editor Top Toolbar */}
      <div className="bg-[#141426]/90 backdrop-blur-xl border-b border-gold/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="text-xs text-white/60 hover:text-gold flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Кабинетке қайту</span>
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-xs font-serif font-bold text-gold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Canvas Editor v3
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="primary" size="sm" onClick={handleSave} className="text-xs">
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-1 text-teal-300" /> Сақталды!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" /> Сақтау
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inspector Panel */}
        <Card className="lg:col-span-4 p-6 border-gold/30 space-y-6">
          <h3 className="font-serif font-bold text-lg text-gold flex items-center gap-2">
            <Layout className="w-5 h-5" /> Инспектор свойств
          </h3>

          {activeDock === "text" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-white/70">Басты атау (Тақырып):</label>
                <Input
                  value={canvasState.title}
                  onChange={(e) => setCanvasState({ ...canvasState, title: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Субтитр:</label>
                <Input
                  value={canvasState.subtitle}
                  onChange={(e) => setCanvasState({ ...canvasState, subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Өтетін күні:</label>
                <Input
                  value={canvasState.date}
                  onChange={(e) => setCanvasState({ ...canvasState, date: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Ресторан / Орны:</label>
                <Input
                  value={canvasState.venue}
                  onChange={(e) => setCanvasState({ ...canvasState, venue: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeDock === "color" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-white/70">Акцент түсі:</label>
                <div className="flex items-center gap-3">
                  {["#C9A96E", "#D4848C", "#5A8A7A", "#C46B7A", "#A68B4B"].map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setCanvasState({ ...canvasState, accentColor: clr })}
                      style={{ backgroundColor: clr }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        canvasState.accentColor === clr ? "scale-110 border-white" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeDock === "music" && (
            <div className="space-y-3">
              <label className="text-xs text-white/70">Фондық әуен таңдау:</label>
              {["Үйлену той вальсі", "Қыз ұзату әні", "Қазақша рояль"].map((m) => (
                <div
                  key={m}
                  onClick={() => setCanvasState({ ...canvasState, musicTitle: m })}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    canvasState.musicTitle === m
                      ? "border-gold bg-gold/10 text-gold font-bold"
                      : "border-white/10 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {m}
                </div>
              ))}
            </div>
          )}

          {activeDock === "photo" && (
            <div className="p-4 rounded-xl border border-dashed border-white/20 text-center text-xs text-white/50">
              Галереяға фотосуреттер жүктеу үшін "Шақыру жасау" шеберіне (Wizard) өтіңіз.
            </div>
          )}
        </Card>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="w-full max-w-sm bg-[#21213B] border border-gold/40 rounded-3xl p-6 shadow-2xl space-y-6 text-center gold-border-glow">
            <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/40 mx-auto flex items-center justify-center text-gold">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <Badge variant="gold">{canvasState.subtitle}</Badge>
              <h1 className="text-3xl font-serif font-bold" style={{ color: canvasState.accentColor }}>
                {canvasState.title}
              </h1>
              <p className="text-xs text-white/60">LIVE CANVAS PREVIEW</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A1A2E] border border-white/10 text-xs space-y-2 text-left">
              <p className="text-white/50">Күні:</p>
              <p className="font-semibold text-white">{canvasState.date}</p>
              <p className="text-white/50 pt-2">Мекенжай:</p>
              <p className="font-semibold text-white">{canvasState.venue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Dock */}
      <Dock items={dockItems} />
    </div>
  );
}
