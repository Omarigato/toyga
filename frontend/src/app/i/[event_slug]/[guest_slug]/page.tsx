"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "@/context/i18n-context";
import { CheckCircle2, XCircle, Heart, MapPin, Calendar, Music, Globe } from "lucide-react";

export default function PersonalInvitationPage() {
  const params = useParams();
  const { lang, setLang, t } = useI18n();

  const guestSlug = (params?.guest_slug as string) || "erzhan";
  const guestName = guestSlug === "erzhan" ? "Ержан мырза" : "Құрметті қонақ";

  const [status, setStatus] = useState<"accepted" | "declined" | "pending">("pending");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Top Language Toggle Switcher */}
      <div className="absolute top-4 right-4 z-50 flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
        <Globe className="w-4 h-4 text-amber-400 ml-2 mr-1" />
        <button
          onClick={() => setLang("kk")}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${lang === "kk" ? "bg-amber-500 text-black shadow-lg" : "text-white/70 hover:text-white"
            }`}
        >
          ҚАЗ
        </button>
        <button
          onClick={() => setLang("ru")}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${lang === "ru" ? "bg-amber-500 text-black shadow-lg" : "text-white/70 hover:text-white"
            }`}
        >
          РУС
        </button>
      </div>

      {/* Main Luxury Mobile Invitation Card */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
        {/* Header Ornament */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Heart className="w-8 h-8 fill-amber-400/20" />
          </div>
        </div>

        {/* Guest Greeting */}
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            {t("rsvp.heading")}
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            {guestName}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {lang === "kk"
              ? "Сізді Омар мен Маржанның үйлену тойына арнайы шақырамыз!"
              : "Приглашаем вас на свадьбу Омара и Маржан!"}
          </p>
        </div>

        {/* Event Meta Details */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xs text-gray-400">{lang === "kk" ? "Күні мен уақыты" : "Дата и время"}</p>
              <p className="text-sm font-semibold">25 Тамыз 2026, 18:00</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xs text-gray-400">{lang === "kk" ? "Мекенжай" : "Адрес"}</p>
              <p className="text-sm font-semibold">"Алтын Шатыр Luxe" Рестораны, Астана қ.</p>
            </div>
          </div>
        </div>

        {/* Interactive RSVP Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <p className="text-sm font-medium text-amber-400 text-center">
              {t("rsvp.question")}
            </p>

            {/* Attendance Choice Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("accepted")}
                className={`flex items-center justify-center space-x-2 py-3 rounded-2xl text-sm font-semibold border transition-all ${status === "accepted"
                    ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20"
                    : "bg-white/5 text-gray-300 border-white/10 hover:border-amber-500/50"
                  }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("rsvp.accept")}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("declined")}
                className={`flex items-center justify-center space-x-2 py-3 rounded-2xl text-sm font-semibold border transition-all ${status === "declined"
                    ? "bg-rose-500/80 text-white border-rose-500 shadow-lg shadow-rose-500/20"
                    : "bg-white/5 text-gray-300 border-white/10 hover:border-rose-500/50"
                  }`}
              >
                <XCircle className="w-4 h-4" />
                <span>{t("rsvp.decline")}</span>
              </button>
            </div>

            {/* If Attending: Select exact persons count */}
            {status === "accepted" && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-xs text-gray-300 font-medium">
                  {t("rsvp.guests_count")}
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={1} className="bg-zinc-900 text-white">1 адам (Өзім)</option>
                  <option value={2} className="bg-zinc-900 text-white">2 адам (+1)</option>
                  <option value={3} className="bg-zinc-900 text-white">3 адам (Семья)</option>
                  <option value={4} className="bg-zinc-900 text-white">4+ адам</option>
                </select>
              </div>
            )}

            {/* Comment field */}
            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-medium">
                {t("rsvp.comment")}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("rsvp.comment_placeholder")}
                rows={2}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={status === "pending"}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-xl shadow-amber-500/20 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {t("rsvp.submit")}
            </button>
          </form>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-400">
              {t("rsvp.success")}
            </h3>
            <p className="text-xs text-gray-300">
              {status === "accepted"
                ? `${guestsCount} адам болып қатысуыңыз тіркелді.`
                : "Жауабыңыз ұйымдастырушыларға жеткізілді."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
