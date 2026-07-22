"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useI18n } from "@/context/i18n-context";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Save, Sparkles, MapPin, Music, Calendar,
  UserPlus, Upload, Plus, Trash2, Heart, Play, Pause, ExternalLink, ShieldCheck, Navigation
} from "lucide-react";

export default function WizardPage() {
  const { t, lang } = useI18n();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  // 12 Step Titles from i18n
  const steps = [
    t("wizard.step1"),
    t("wizard.step2"),
    t("wizard.step3"),
    t("wizard.step4"),
    t("wizard.step5"),
    t("wizard.step6"),
    t("wizard.step7"),
    t("wizard.step8"),
    t("wizard.step9"),
    t("wizard.step10"),
    t("wizard.step11"),
    t("wizard.step12")
  ];

  // Full Real Wizard Form State
  const [formData, setFormData] = useState({
    category: "uylenu-toy",
    templateId: "altyn-shatyr-luxe",
    accentColor: "#C9A227",
    fontFamily: "Playfair Display",
    title: "Омар & Маржан",
    subtitle: "Үйлену тойына шақыру",
    groomName: "Омар",
    brideName: "Маржан",
    eventDate: "2026-08-25",
    eventTime: "18:00",
    venueName: "'Алтын Шатыр Luxe' Рестораны",
    address: "Астана қ., Тұран даңғылы 24",
    gisUrl: "https://2gis.kz/astana",
    musicTrack: "Үйлену той вальсі",
    programItems: [
      { time: "18:00", title: "Қонақтардың жиналуы", desc: "Welcome drink & фотозона" },
      { time: "19:00", title: "Тойдың салтанатты ашылуы", desc: "Жас жубайлардын кіруі" },
      { time: "22:00", title: "Торт кесу & Беташар", desc: "Естелік фотолар" }
    ],
    guests: [
      { name: "Ержан Асан", group: "Құдалар", phone: "+77011234567" },
      { name: "Серік Айтбаев", group: "Достар", phone: "+77029876543" }
    ],
    newGuestName: "",
    newGuestGroup: "Достар",
    newProgTime: "20:00",
    newProgTitle: "Би & Ойындар"
  });

  const handleNext = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (currentStep < 12) setCurrentStep((c) => c + 1);
    }, 300);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((c) => c - 1);
  };

  const addGuest = () => {
    if (!formData.newGuestName) return;
    setFormData({
      ...formData,
      guests: [...formData.guests, { name: formData.newGuestName, group: formData.newGuestGroup, phone: "" }],
      newGuestName: ""
    });
  };

  const addProgramItem = () => {
    if (!formData.newProgTitle) return;
    setFormData({
      ...formData,
      programItems: [...formData.programItems, { time: formData.newProgTime, title: formData.newProgTitle, desc: "" }],
      newProgTitle: ""
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] dark:bg-[#000000] light:bg-[#f5f5f7] text-white dark:text-white light:text-[#1d1d1f] flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
        {/* Wizard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 dark:border-white/10 light:border-black/10 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold">{t("wizard.title")}</h1>
            <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1">{t("wizard.subtitle")}</p>
          </div>
          {saving && (
            <div className="flex items-center space-x-2 text-xs text-amber-400 animate-pulse bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
              <Save className="w-4 h-4" />
              <span>Сақталуда...</span>
            </div>
          )}
        </div>

        {/* 12-Step Interactive Progress Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none">
          {steps.map((st, idx) => {
            const stepNum = idx + 1;
            const active = stepNum === currentStep;
            const completed = stepNum < currentStep;
            return (
              <button
                key={idx}
                onClick={() => setCurrentStep(stepNum)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                  active
                    ? "bg-[#0071e3] text-white border-blue-400 shadow-md shadow-blue-500/20 font-bold"
                    : completed
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-white/5 dark:bg-white/5 light:bg-black/5 text-gray-400 border-white/10 dark:border-white/10 light:border-black/10"
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Step Container Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#121214] dark:from-[#1c1c1e] dark:to-[#121214] light:from-white light:to-stone-100 border border-amber-500/30 dark:border-amber-500/30 light:border-black/10 shadow-2xl space-y-8">
          
          {/* STEP 1: CATEGORY SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step1")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: t("categories.uylenu"), id: "uylenu-toy" },
                  { name: t("categories.kyz_uzatu"), id: "kyz-uzatu" },
                  { name: t("categories.kudalyk"), id: "kudalyk" },
                  { name: t("categories.auyzashar"), id: "auyzashar" },
                  { name: t("categories.tsusakeser"), id: "tsusakeser" }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFormData({ ...formData, category: c.id })}
                    className={`p-6 rounded-2xl border text-left space-y-2 transition-all ${
                      formData.category === c.id
                        ? "bg-amber-500 text-black border-amber-400 shadow-xl font-bold"
                        : "bg-white/5 dark:bg-white/5 light:bg-stone-50 border-white/10 hover:border-amber-400/50"
                    }`}
                  >
                    <Heart className="w-6 h-6 text-amber-400" />
                    <h3 className="text-lg font-serif font-bold">{c.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: TEMPLATE SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step2")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { id: "altyn-shatyr-luxe", name: "Алтын Шатыр Luxe", price: "4 990 ₸" },
                  { id: "meruert-naziktigi", name: "Меруерт Нәзіктігі", price: "0 ₸" },
                  { id: "kudalyk-syi", name: "Құдалық Сый-Құрмет", price: "4 990 ₸" }
                ].map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => setFormData({ ...formData, templateId: tmpl.id })}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-4 ${
                      formData.templateId === tmpl.id
                        ? "bg-amber-500/10 border-amber-400 ring-2 ring-amber-400 shadow-xl"
                        : "bg-white/5 border-white/10 hover:border-amber-400/40"
                    }`}
                  >
                    <div className="h-36 bg-gradient-to-br from-amber-900/40 to-black rounded-xl p-4 flex flex-col justify-end">
                      <span className="text-xs text-amber-400 font-bold uppercase">{tmpl.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-serif font-bold">{tmpl.name}</span>
                      <span className="text-sm font-bold text-amber-400">{tmpl.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: COLOR PALETTE & FONTS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step3")}</h2>
              <div className="space-y-4">
                <label className="text-xs font-semibold uppercase text-gray-400">Акцент түсін таңдаңыз:</label>
                <div className="flex gap-4">
                  {["#C9A227", "#D8A39D", "#0071E3", "#10B981", "#E11D48"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, accentColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-12 h-12 rounded-full border-4 transition-transform ${
                        formData.accentColor === color ? "border-white scale-110 shadow-lg" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <label className="text-xs font-semibold uppercase text-gray-400">Қаріп стилеуін таңдаңыз (Font):</label>
                <div className="grid grid-cols-2 gap-4">
                  {["Playfair Display", "Cormorant Garamond", "Inter"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormData({ ...formData, fontFamily: f })}
                      className={`p-4 rounded-xl border font-bold text-sm transition-all ${
                        formData.fontFamily === f ? "bg-amber-500 text-black border-amber-400" : "bg-white/5 border-white/10"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TEXTS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step4")}</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs text-gray-400 font-semibold">{t("wizard.form.title_label")}</label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3.5 mt-1 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold">Субтитр / Шақыру мәтіні:</label>
                  <input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3.5 mt-1 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: TIME & LOCATION (2GIS) */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step5")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-xs text-gray-400 font-semibold">{t("wizard.form.date_label")}</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3.5 mt-1 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold">{t("wizard.form.time_label")}</label>
                  <input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3.5 mt-1 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold">{t("wizard.form.venue_label")}</label>
                  <input
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3.5 mt-1 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold">{t("wizard.form.gis_label")}</label>
                  <input
                    value={formData.gisUrl}
                    onChange={(e) => setFormData({ ...formData, gisUrl: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3.5 mt-1 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: MUSIC TRACK */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step6")}</h2>
              <div className="space-y-3">
                {["Үйлену той вальсі", "Махаббат әуені", "Домбыра сазы (Сән)", "Қыз ұзату әні"].map((track) => (
                  <button
                    key={track}
                    onClick={() => setFormData({ ...formData, musicTrack: track })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      formData.musicTrack === track ? "bg-amber-500 text-black border-amber-400 font-bold" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Music className="w-5 h-5" />
                      <span>{track}</span>
                    </div>
                    {formData.musicTrack === track && <CheckCircle2 className="w-5 h-5 text-black" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: GALLERY */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step7")}</h2>
              <div className="border-2 border-dashed border-white/20 rounded-3xl p-10 text-center space-y-4">
                <Upload className="w-12 h-12 text-amber-400 mx-auto" />
                <div>
                  <p className="text-sm font-bold">Суреттерді жүктеу үшін басыңыз</p>
                  <p className="text-xs text-gray-400">PNG, JPG 10MB дейін (Google Drive-қа сақталады)</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: PROGRAM SCHEDULE */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step8")}</h2>
              <div className="space-y-3">
                {formData.programItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-400 font-bold">{item.time}</span>
                      <h4 className="text-sm font-bold">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  value={formData.newProgTime}
                  onChange={(e) => setFormData({ ...formData, newProgTime: e.target.value })}
                  placeholder="20:00"
                  className="w-24 bg-white/10 border border-white/20 rounded-xl p-2.5 text-xs text-white"
                />
                <input
                  value={formData.newProgTitle}
                  onChange={(e) => setFormData({ ...formData, newProgTitle: e.target.value })}
                  placeholder="Атауы..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl p-2.5 text-xs text-white"
                />
                <button onClick={addProgramItem} className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs">
                  Қосу
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: GUESTS LIST */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step9")}</h2>
              <div className="space-y-2">
                {formData.guests.map((g, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="font-bold">{g.name}</span>
                    <span className="px-2.5 py-1 rounded bg-white/10">{g.group}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={formData.newGuestName}
                  onChange={(e) => setFormData({ ...formData, newGuestName: e.target.value })}
                  placeholder="Қонақ аты..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl p-2.5 text-xs text-white"
                />
                <button onClick={addGuest} className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs">
                  {t("wizard.form.guest_add")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 10: LIVE PREVIEW */}
          {currentStep === 10 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step10")}</h2>
              <div className="max-w-sm mx-auto p-8 rounded-3xl bg-[#141416] border border-amber-500/40 space-y-4 shadow-2xl">
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-3xl font-serif font-bold">{formData.title}</h3>
                <p className="text-xs text-amber-400">{formData.subtitle}</p>
                <p className="text-xs text-gray-400">{formData.eventDate} | {formData.venueName}</p>
              </div>
            </div>
          )}

          {/* STEP 11: PAYMENT CHECKOUT */}
          {currentStep === 11 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step11")}</h2>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 max-w-md mx-auto">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-widest">Разовый төлем</span>
                <div className="text-4xl font-serif font-bold text-amber-400">4 990 ₸</div>
                <Link
                  href="/payment/checkout"
                  className="block w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-xl"
                >
                  Оплата жасау &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* STEP 12: PUBLISH & SHARE LINK */}
          {currentStep === 12 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-serif font-bold text-amber-500">{t("wizard.step12")}</h2>
              <div className="p-8 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 space-y-4 max-w-md mx-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-serif font-bold text-white">Шақыруыңыз сәтті жарияланды!</h3>
                <p className="text-xs text-gray-300">Сіздің шақыру сілтемеңіз дайын:</p>
                <input
                  readOnly
                  value="https://toyga.kz/i/omar-marzhan/erzhan"
                  className="w-full bg-black/50 border border-emerald-500/40 rounded-xl p-3 text-center text-xs text-emerald-400 font-mono"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 dark:border-white/10 light:border-black/10">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm disabled:opacity-30 hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t("btn.back")}</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-8 py-3 rounded-full bg-[#0071e3] hover:bg-[#0066cc] text-white font-bold text-sm hover:scale-105 shadow-lg shadow-blue-500/20 transition-all"
            >
              <span>{currentStep === 12 ? t("btn.finish") : t("btn.next")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
