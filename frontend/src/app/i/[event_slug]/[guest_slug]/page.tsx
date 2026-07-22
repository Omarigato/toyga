"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AudioPlayer } from "@/components/ui/audio-player";
import { Countdown } from "@/components/ui/countdown";
import { MapEmbed } from "@/components/ui/map-embed";
import { CheckCircle2, Heart, Globe, Sparkles, Send } from "lucide-react";

export default function PersonalInvitationPage() {
  const params = useParams();
  const { lang, setLang, t } = useI18n();

  const guestSlug = (params?.guest_slug as string) || "erzhan";
  const guestName = guestSlug === "erzhan" ? "Ержан мырза" : "Құрметті қонақ";

  const [status, setStatus] = useState<"accepted" | "declined" | "pending">("pending");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [guestbook, setGuestbook] = useState<Array<{ name: string; text: string }>>([
    { name: "Арман & Әлия", text: "Жас жубайларға бақыт пен махаббат тілейміз!" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (comment) {
      setGuestbook([...guestbook, { name: guestName, text: comment }]);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Top Floating Controls: Audio Player & Language Switcher */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between bg-[#141426]/90 backdrop-blur-xl p-3 rounded-full border border-gold/30 shadow-2xl">
        <AudioPlayer title="Үйлену той әуені" autoPlay />

        <div className="flex items-center space-x-1 bg-[#252542] border border-white/10 rounded-full p-1">
          <Globe className="w-4 h-4 text-gold ml-2 mr-1" />
          <button
            type="button"
            onClick={() => setLang("kk")}
            className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
              lang === "kk" ? "bg-gold text-ink" : "text-white/60"
            }`}
          >
            ҚАЗ
          </button>
          <button
            type="button"
            onClick={() => setLang("ru")}
            className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
              lang === "ru" ? "bg-gold text-ink" : "text-white/60"
            }`}
          >
            РУС
          </button>
        </div>
      </div>

      {/* Main Luxury Mobile Invitation Container */}
      <div className="w-full max-w-md bg-[#21213B] border border-gold/40 rounded-3xl p-6 shadow-2xl space-y-8 text-center pt-20 gold-border-glow">
        {/* Header Ornament */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shadow-md">
            <Heart className="w-8 h-8 fill-gold/20" />
          </div>
        </div>

        {/* Guest Greeting */}
        <div className="space-y-2">
          <Badge variant="gold">Арнайы шақыру</Badge>
          <h2 className="text-2xl font-serif font-bold text-gold">{guestName}</h2>
          <h1 className="text-3xl font-serif font-bold text-white">
            Омар & Маржан
          </h1>
          <p className="text-sm text-white/70">
            {lang === "kk"
              ? "Сізді тойымыздың қадірлі қонағы болуға шақырамыз!"
              : "Приглашаем вас стать почетным гостем нашего торжества!"}
          </p>
        </div>

        {/* Countdown */}
        <Countdown targetDate="2026-08-25T18:00:00" />

        {/* Map Embed */}
        <MapEmbed
          venueName="Altyn Shatyr Grand Ballroom"
          address="Алматы қ., Әл-Фараби даңғылы, 77/7"
          gisUrl="https://2gis.kz"
          yandexUrl="https://yandex.kz/maps"
        />

        {/* Interactive RSVP Form */}
        <Card className="p-6 space-y-4 border-gold/30 bg-[#1A1A2E]/90 text-left">
          <h3 className="font-serif font-bold text-lg text-gold text-center">
            {t("rsvp.question")}
          </h3>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={status === "accepted" ? "primary" : "outline"}
                  onClick={() => setStatus("accepted")}
                  className="w-full text-xs"
                >
                  Келемін
                </Button>
                <Button
                  type="button"
                  variant={status === "declined" ? "destructive" : "outline"}
                  onClick={() => setStatus("declined")}
                  className="w-full text-xs"
                >
                  Келе алмаймын
                </Button>
              </div>

              {status === "accepted" && (
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Қонақтар саны:</label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-white/70">Ақ тілегіңіз:</label>
                <Textarea
                  placeholder="Жас жұбайларға ізгі тілек..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                <Send className="w-4 h-4 mr-2" /> Жауапты жіберу
              </Button>
            </form>
          ) : (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Жауабыңыз қабылданды!</h4>
              <p className="text-xs text-white/60">Ақ тілегіңізге рахмет!</p>
            </div>
          )}
        </Card>

        {/* Guestbook Wall */}
        <div className="space-y-4 text-left border-t border-white/10 pt-6">
          <h3 className="font-serif font-bold text-lg text-gold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" /> Гостевая книга (Қонақтар тілегі)
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {guestbook.map((gb, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <p className="font-bold text-gold">{gb.name}</p>
                <p className="text-white/80 mt-1 italic">"{gb.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
