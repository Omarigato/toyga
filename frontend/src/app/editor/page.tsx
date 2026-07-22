"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import { Save, Layers, Palette, Type, Music, Image as ImageIcon, Eye, ArrowLeft, Sparkles } from "lucide-react";

export default function CanvasEditorPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"text" | "color" | "music" | "bg">("text");
  const [canvasState, setCanvasState] = useState({
    title: "Омар & Маржан",
    subtitle: "Үйлену тойына шақыру",
    date: "25 Тамыз 2026",
    color: "#C9A227",
    font: "Playfair Display",
    background: "dark"
  });

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex flex-col font-sans">
      <Navbar />

      {/* Editor Top Toolbar */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-amber-400 flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Кабинетке қайту</span>
          </Link>
          <span className="text-gray-600">|</span>
          <span className="text-xs font-serif font-bold text-amber-400">Live Canvas Editor v3</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert("Дизайн сәтті сақталды!")}
            className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg flex items-center space-x-1 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Сақтау</span>
          </button>
        </div>
      </div>

      {/* Editor Main Workspace (Split View) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Inspector Sidebar */}
        <div className="w-full lg:w-80 bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-white/10 rounded-3xl p-6 space-y-6 flex-shrink-0">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-2 rounded-xl transition-all ${activeTab === "text" ? "bg-amber-500 text-black" : "text-gray-400"}`}
            >
              Мәтін
            </button>
            <button
              onClick={() => setActiveTab("color")}
              className={`flex-1 py-2 rounded-xl transition-all ${activeTab === "color" ? "bg-amber-500 text-black" : "text-gray-400"}`}
            >
              Түс
            </button>
            <button
              onClick={() => setActiveTab("music")}
              className={`flex-1 py-2 rounded-xl transition-all ${activeTab === "music" ? "bg-amber-500 text-black" : "text-gray-400"}`}
            >
              Әуен
            </button>
          </div>

          {activeTab === "text" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 font-medium">Басты атау:</label>
                <input
                  value={canvasState.title}
                  onChange={(e) => setCanvasState({ ...canvasState, title: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 mt-1 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 font-medium">Субтитр:</label>
                <input
                  value={canvasState.subtitle}
                  onChange={(e) => setCanvasState({ ...canvasState, subtitle: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 mt-1 text-white"
                />
              </div>
            </div>
          )}

          {activeTab === "color" && (
            <div className="space-y-3">
              <label className="text-xs text-gray-400">Акцент түсін таңдаңыз:</label>
              <div className="flex gap-3">
                {["#C9A227", "#D8A39D", "#0071E3", "#10B981", "#E11D48"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCanvasState({ ...canvasState, color: c })}
                    style={{ backgroundColor: c }}
                    className="w-8 h-8 rounded-full border-2 border-white/40 hover:scale-110 transition-transform"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Live Invitation Canvas Viewport */}
        <div className="flex-1 bg-gradient-to-b from-[#18181a] to-[#0c0c0d] border border-amber-500/20 rounded-3xl p-8 flex items-center justify-center min-h-[500px] relative shadow-2xl">
          <div className="w-full max-w-sm bg-[#141416] border border-amber-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <Sparkles className="w-10 h-10 mx-auto text-amber-400" />
            <span style={{ color: canvasState.color }} className="text-xs uppercase tracking-widest font-bold">
              {canvasState.subtitle}
            </span>
            <h2 className="text-4xl font-serif font-bold text-white">{canvasState.title}</h2>
            <p className="text-xs text-gray-400">{canvasState.date}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
