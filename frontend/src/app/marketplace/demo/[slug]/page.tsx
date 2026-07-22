"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/context/i18n-context";
import { Heart, Calendar, MapPin, Music, Play, Pause, CheckCircle2, ArrowLeft, ArrowRight, Sparkles, Navigation } from "lucide-react";

export default function TemplateDemoPage() {
  const params = useParams();
  const { lang, setLang, t } = useI18n();

  const slug = (params?.slug as string) || "altyn-shatyr-luxe";
  const [isPlaying, setIsPlaying] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"accepted" | "declined" | "pending">("pending");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Back to Marketplace Header bar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/20">
        <Link href="/marketplace" className="flex items-center space-x-2 text-xs font-semibold text-gray-300 hover:text-amber-400">
          <ArrowLeft className="w-4 h-4" />
          <span>Маркетплейске кайту</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Музыка тоқтату" : "Музыка қосу"}</span>
          </button>

          <Link
            href={`/wizard?template=${slug}`}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-1"
          >
            <span>Осы шаблонды таңдау</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Luxury Envelope & Interactive Digital Invitation Demo */}
      {!envelopeOpen ? (
        <div className="max-w-md w-full text-center space-y-6 pt-16">
          <div
            onClick={() => setEnvelopeOpen(true)}
            className="p-10 rounded-3xl bg-gradient-to-b from-[#221f19] to-[#14120e] border border-amber-500/40 shadow-2xl space-y-6 cursor-pointer group hover:scale-105 transition-all"
          >
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/60 mx-auto flex items-center justify-center text-amber-400 group-hover:rotate-12 transition-transform">
              <Heart className="w-10 h-10 fill-amber-400/20" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Демо режим</span>
              <h1 className="text-3xl font-serif font-bold text-white">Омар & Маржан</h1>
              <p className="text-xs text-gray-400">Шақыру конвертін ашу үшін басыңыз &rarr;</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6 text-center pt-20 animate-fadeIn">
          {/* Header Ornament */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Үйлену тойына шақыру
            </span>
            <h1 className="text-3xl font-serif font-bold text-white mt-1">
              Омар & Маржан
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Сізді қуанышымызға ортақ болуға шақырамыз!
            </p>
          </div>

          {/* Event Details */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-xs text-gray-400">Күні мен уақыты</p>
                <p className="text-sm font-semibold">25 Тамыз 2026, 18:00</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-2">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs text-gray-400">Мекенжай</p>
                  <p className="text-sm font-semibold">"Алтын Шатыр Luxe" Рестораны</p>
                </div>
              </div>

              <a
                href="https://2gis.kz/astana"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center space-x-1 hover:bg-emerald-500 hover:text-black transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>2GIS</span>
              </a>
            </div>
          </div>

          {/* Demo RSVP Form */}
          {!submitted ? (
            <div className="space-y-4 text-left border-t border-white/10 pt-4">
              <p className="text-sm font-medium text-amber-400 text-center">
                Тойға қатысуыңызды растаңыз:
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("accepted")}
                  className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                    rsvpStatus === "accepted" ? "bg-amber-500 text-black border-amber-400" : "bg-white/5 text-gray-300 border-white/10"
                  }`}
                >
                  Иә, барамын
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus("declined")}
                  className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                    rsvpStatus === "declined" ? "bg-rose-500 text-white border-rose-400" : "bg-white/5 text-gray-300 border-white/10"
                  }`}
                >
                  Бара алмаймын
                </button>
              </div>

              {rsvpStatus === "accepted" && (
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Қанша адам келесіздер?</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value={1} className="bg-zinc-900">1 адам</option>
                    <option value={2} className="bg-zinc-900">2 адам (+1)</option>
                    <option value={3} className="bg-zinc-900">3 адам (Семья)</option>
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="w-full py-3 rounded-2xl bg-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20"
              >
                Жауапты жіберу (Демо)
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold space-y-1">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <p>Демо RSVP жауабыңыз тіркелді!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
