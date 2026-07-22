"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/context/i18n-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/ui/audio-player";
import { Countdown } from "@/components/ui/countdown";
import { MapEmbed } from "@/components/ui/map-embed";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Calendar, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function TemplateDemoPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "altyn-shatyr-luxe";
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [rsvpDialogOpen, setRsvpDialogOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"accepted" | "declined" | "pending">("pending");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setRsvpDialogOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Back & Top Bar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between bg-[#141426]/90 backdrop-blur-xl p-3 rounded-full border border-gold/30 shadow-2xl">
        <Link href="/templates" className="flex items-center space-x-2 text-xs font-semibold text-white/80 hover:text-gold">
          <ArrowLeft className="w-4 h-4" />
          <span>Маркетплейске қайту</span>
        </Link>

        <div className="flex items-center space-x-3">
          <AudioPlayer title="Үйлену той вальсі" autoPlay={envelopeOpen} />

          <Link href={`/wizard?template=${slug}`}>
            <Button variant="primary" size="sm" className="text-xs hidden sm:flex">
              <span>Осы шаблонды таңдау</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Luxury Envelope */}
      {!envelopeOpen ? (
        <div className="max-w-md w-full text-center space-y-6 pt-16">
          <Card
            onClick={() => setEnvelopeOpen(true)}
            hoverGlow
            className="p-10 border-gold/50 shadow-2xl space-y-6 cursor-pointer group hover:scale-105 transition-all text-center bg-gradient-to-b from-[#252542] to-[#1A1A2E]"
          >
            <div className="w-20 h-20 rounded-full bg-gold/20 border border-gold/60 mx-auto flex items-center justify-center text-gold group-hover:rotate-12 transition-transform shadow-lg">
              <Heart className="w-10 h-10 fill-gold/20" />
            </div>

            <div className="space-y-2">
              <Badge variant="gold">Эксклюзивті шақыру</Badge>
              <h1 className="text-3xl font-serif font-bold text-gold">Омар & Маржан</h1>
              <p className="text-xs text-white/60">Шақыру конвертін ашу үшін басыңыз &rarr;</p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="max-w-md w-full bg-[#21213B] border border-gold/40 rounded-3xl p-6 shadow-2xl space-y-8 text-center pt-20 gold-border-glow">
          {/* Header Ornament */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          <div>
            <Badge variant="gold">Үйлену тойына шақыру</Badge>
            <h1 className="text-4xl font-serif font-bold text-gold mt-2">
              Омар & Маржан
            </h1>
            <p className="text-sm text-white/70 mt-2">
              Сізді қуанышымызға ортақ болуға шақырамыз!
            </p>
          </div>

          {/* Countdown Component */}
          <Countdown targetDate="2026-08-25T18:00:00" />

          {/* Location Component */}
          <MapEmbed
            venueName="Altyn Shatyr Grand Ballroom"
            address="Алматы қ., Әл-Фараби даңғылы, 77/7"
            gisUrl="https://2gis.kz"
            yandexUrl="https://yandex.kz/maps"
          />

          {/* RSVP CTA */}
          <Card className="p-6 space-y-4 border-gold/30 bg-[#1A1A2E]/80">
            <h3 className="font-serif font-bold text-lg text-gold">Тойға қатысуыңызды растаңыз</h3>
            <p className="text-xs text-white/60">Жауабыңызды 15 тамызға дейін күтеміз</p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setRsvpDialogOpen(true)}
            >
              Жауап беру (RSVP)
            </Button>
          </Card>
        </div>
      )}

      {/* RSVP Dialog */}
      <Dialog open={rsvpDialogOpen} onOpenChange={setRsvpDialogOpen}>
        <DialogContent className="bg-[#1A1A2E] border-gold/40">
          <DialogHeader>
            <DialogTitle>RSVP жауап беру</DialogTitle>
            <DialogDescription>
              Омар мен Маржанның тойына қатысуыңызды белгілеңіз
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Жауабыңыз қабылданды!</h4>
              <p className="text-xs text-white/60">Рахмет, тойда кездескенше!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitRSVP} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={rsvpStatus === "accepted" ? "primary" : "outline"}
                  onClick={() => setRsvpStatus("accepted")}
                  className="w-full text-xs"
                >
                  Келемін
                </Button>
                <Button
                  type="button"
                  variant={rsvpStatus === "declined" ? "destructive" : "outline"}
                  onClick={() => setRsvpStatus("declined")}
                  className="w-full text-xs"
                >
                  Келе алмаймын
                </Button>
              </div>

              {rsvpStatus === "accepted" && (
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
                <label className="text-xs text-white/70">Ізгі тілегіңіз:</label>
                <Textarea
                  placeholder="Жас жубайларға ақ тілек..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Жіберу
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
