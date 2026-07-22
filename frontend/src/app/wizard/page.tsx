"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Stepper, StepItem } from "@/components/ui/stepper";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { ChevronRight, ChevronLeft, Save, Sparkles, MapPin, Music, Plus, Trash2, Heart, CheckCircle2 } from "lucide-react";

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-08-25"));

  const stepItems: StepItem[] = [
    { id: 1, title: "Санат" },
    { id: 2, title: "Шаблон" },
    { id: 3, title: "Түс пен Шрифт" },
    { id: 4, title: "Негізгі Ақпарат" },
    { id: 5, title: "Дата мен Уақыт" },
    { id: 6, title: "Мекенжай & 2GIS" },
    { id: 7, title: "Бағдарлама" },
    { id: 8, title: "Әуен" },
    { id: 9, title: "Фотогалерея" },
    { id: 10, title: "Қонақтар" },
    { id: 11, title: "Превью" },
    { id: 12, title: "Жариялау" },
  ];

  const [formData, setFormData] = useState({
    category: "uylenu-toy",
    templateId: "altyn-shatyr-luxe",
    accentColor: "#C9A96E",
    title: "Омар & Маржан",
    subtitle: "Үйлену тойына шақыру",
    eventTime: "18:00",
    venueName: "Altyn Shatyr Grand Ballroom",
    address: "Алматы қ., Әл-Фараби даңғылы 77/7",
    gisUrl: "https://2gis.kz/almaty",
    musicTrack: "Үйлену той вальсі",
    guests: [
      { name: "Ержан Асан", group: "Құдалар" },
      { name: "Серік Айтбаев", group: "Достар" },
    ],
    newGuestName: "",
    newGuestGroup: "Достар",
  });

  const handleNext = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (currentStep < 12) setCurrentStep((c) => c + 1);
    }, 200);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((c) => c - 1);
  };

  const addGuest = () => {
    if (!formData.newGuestName) return;
    setFormData({
      ...formData,
      guests: [...formData.guests, { name: formData.newGuestName, group: formData.newGuestGroup }],
      newGuestName: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <Badge variant="gold">Интерактивті Конструктор</Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gold">
            Шақыру жасау шебері
          </h1>
          <p className="text-xs text-white/60">
            Барлық қадамдар автоматты түрде сақталады
          </p>
        </div>

        {/* Stepper */}
        <Stepper steps={stepItems} currentStep={currentStep} onStepClick={setCurrentStep} />

        {/* Step Card Content */}
        <Card className="p-8 border-gold/30 space-y-6">
          {/* Step 1: Category */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-gold">1. Тойыңыздың санатын таңдаңыз</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { slug: "uylenu-toy", label: "Үйлену той" },
                  { slug: "kyz-uzatu", label: "Қыз ұзату" },
                  { slug: "kudalyk", label: "Құдалық" },
                  { slug: "auyzashar", label: "Ауызашар" },
                  { slug: "tsusakeser", label: "Тұсаукесер" },
                ].map((cat) => (
                  <div
                    key={cat.slug}
                    onClick={() => setFormData({ ...formData, category: cat.slug })}
                    className={`p-5 rounded-2xl border text-center cursor-pointer transition-all ${
                      formData.category === cat.slug
                        ? "border-gold bg-gold/20 text-gold font-bold shadow-lg"
                        : "border-white/10 bg-[#1A1A2E] text-white/70 hover:border-gold/50"
                    }`}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Template */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-gold">2. Шаблон таңдаңыз</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "altyn-shatyr-luxe", title: "Алтын Шатыр Luxe (Премиум)", price: "4 990 ₸" },
                  { id: "meruert-naziktigi", title: "Меруерт Нәзіктігі (Тегін)", price: "0 ₸" },
                ].map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => setFormData({ ...formData, templateId: tmpl.id })}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      formData.templateId === tmpl.id
                        ? "border-gold bg-gold/20 text-gold font-bold shadow-lg"
                        : "border-white/10 bg-[#1A1A2E] text-white/70 hover:border-gold/50"
                    }`}
                  >
                    <p className="text-lg font-serif">{tmpl.title}</p>
                    <p className="text-xs text-gold/80 mt-1">{tmpl.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Text Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-gold">4. Негізгі Ақпарат</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Шақыру Тақырыбы:</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Субтитр / Матн:</label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Calendar Selection */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-serif font-bold text-gold">5. Тойдың өтетін күнін таңдаңыз</h2>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </div>
            </div>
          )}

          {/* Step 6: Map & Venue */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-gold">6. Мекенжай & 2GIS</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Ресторан / Сарай атауы:</label>
                  <Input
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Адрес:</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Gallery Upload */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-gold">9. Фотосуреттер жүктеу</h2>
              <FileDropzone label="Той иелерінің фотосуретін жүктеу үшін осы жерге сүйреңіз" />
            </div>
          )}

          {/* Step 10: Guest List */}
          {currentStep === 10 && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-gold">10. Қонақтар тізімі</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Қонақ аты-жөні..."
                  value={formData.newGuestName}
                  onChange={(e) => setFormData({ ...formData, newGuestName: e.target.value })}
                />
                <Button variant="primary" size="sm" onClick={addGuest}>
                  <Plus className="w-4 h-4 mr-1" /> Қосу
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                {formData.guests.map((g, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-[#1A1A2E] text-xs">
                    <span className="font-bold text-white">{g.name}</span>
                    <Badge variant="gold">{g.group}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback Step Container */}
          {currentStep !== 1 && currentStep !== 2 && currentStep !== 4 && currentStep !== 5 && currentStep !== 6 && currentStep !== 9 && currentStep !== 10 && (
            <div className="py-8 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-gold mx-auto" />
              <h3 className="text-xl font-serif font-bold text-gold">{stepItems[currentStep - 1].title}</h3>
              <p className="text-xs text-white/60">Баптауларды орнатыңыз немесе келесі қадамға өтіңіз</p>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Артқа
            </Button>

            {currentStep === 12 ? (
              <Link href="/payment/checkout">
                <Button variant="primary" size="lg">
                  Жариялау және Төлеу <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Келесі <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
