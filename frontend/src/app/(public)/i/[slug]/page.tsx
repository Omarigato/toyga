"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { usePublicEvent } from "@/shared/lib/queries";
import { SealSvg } from "@/shared/ui/seal-svg";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function InvitationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: event, isLoading, error } = usePublicEvent(slug);
  const invitationRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!invitationRef.current) return;
    try {
      const dataUrl = await toPng(invitationRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `${event?.title || "invitation"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-[var(--color-gold)]" />
          <p className="text-sm text-stone-500">Загрузка приглашения...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <SealSvg size={64} className="mx-auto mb-4 text-stone-300" />
          <h1 className="text-xl font-semibold text-stone-900">Приглашение не найдено</h1>
          <p className="mt-2 text-sm text-stone-500">Возможно, оно было удалено или ссылка недействительна</p>
        </div>
      </div>
    );
  }

  const content = event.eventContents?.[0]?.contentJson || {};
  const canvas = event.eventContents?.[0]?.canvasJson as any;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <motion.div
          ref={invitationRef}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="overflow-hidden rounded-3xl bg-white shadow-xl"
          style={{ aspectRatio: "9/16" }}
        >
          {canvas?.blocks?.length > 0 ? (
            <div className="relative h-full w-full">
              {canvas.blocks.filter((b: any) => b.visible !== false).map((block: any) => (
                <motion.div
                  key={block.id}
                  variants={fadeUp}
                  className="absolute"
                  style={{
                    left: `${(block.x / (canvas.width || 1080)) * 100}%`,
                    top: `${(block.y / (canvas.height || 1920)) * 100}%`,
                    width: `${(block.width / (canvas.width || 1080)) * 100}%`,
                    height: `${(block.height / (canvas.height || 1920)) * 100}%`,
                    opacity: block.opacity ?? 1,
                  }}
                >
                  {block.type === "text" && (
                    <div
                      className="flex h-full w-full items-center justify-center p-2 text-center"
                      style={{
                        fontSize: block.style?.fontSize || 24,
                        color: block.style?.color || "#333",
                        fontFamily: block.style?.fontFamily || "sans-serif",
                        textAlign: block.style?.textAlign as any,
                        fontWeight: block.style?.fontWeight,
                      }}
                    >
                      {block.content || "Текст"}
                    </div>
                  )}
                  {block.type === "image" && block.src && (
                    <img src={block.src} alt="" className="h-full w-full object-cover" />
                  )}
                  {block.type === "countdown" && event.eventDate && (
                    <CountdownBlock targetDate={event.eventDate} style={block.style} />
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-white p-8">
              <SealSvg size={80} className="text-[var(--color-gold)]" />
              <h1 className="mt-6 text-center font-display text-3xl font-bold text-stone-900">{event.title}</h1>
              {event.location && (
                <p className="mt-3 text-center text-lg text-stone-500">{event.location}</p>
              )}
              {event.eventDate && (
                <p className="mt-2 text-center text-sm uppercase tracking-wider text-[var(--color-gold)]">
                  {new Date(event.eventDate).toLocaleDateString("ru", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-center">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-stone-800 hover:shadow-xl"
          >
            <Download className="h-5 w-5" />
            Скачать приглашение
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function CountdownBlock({ targetDate, style }: { targetDate: string; style?: any }) {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex h-full w-full items-center justify-center" style={{ background: style?.backgroundColor || "rgba(0,0,0,0.05)" }}>
      <div className="text-center">
        <div className="flex gap-2 justify-center">
          {[
            { val: timeLeft.days, label: "Дней" },
            { val: timeLeft.hours, label: "Часов" },
            { val: timeLeft.minutes, label: "Мин" },
            { val: timeLeft.seconds, label: "Сек" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl font-bold" style={{ color: style?.color || "#333" }}>
                {String(item.val).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: style?.color || "#666" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
