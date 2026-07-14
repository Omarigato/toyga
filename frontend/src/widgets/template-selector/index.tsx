"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTemplates, useCloneTemplate, useCreateEvent } from "@/shared/lib/queries";
import { Badge } from "@/shared/ui/badge";
import { SealSvg } from "@/shared/ui/seal-svg";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Loader2 } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

interface TemplateSelectorProps {
  categorySlug?: string;
  onSelect?: (templateId: string) => void;
}

export function TemplateSelector({ categorySlug, onSelect }: TemplateSelectorProps) {
  const router = useRouter();
  const { data: templates = [], isLoading } = useTemplates(categorySlug);
  const cloneTemplate = useCloneTemplate();
  const createEvent = useCreateEvent();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedId(templateId);
    try {
      const cloned: any = await cloneTemplate.mutateAsync(templateId);
      const event: any = await createEvent.mutateAsync({
        templateId: cloned.id,
        title: "Новое мероприятие",
        eventType: "wedding",
        eventDate: new Date().toISOString(),
      });
      if (onSelect) {
        onSelect(cloned.id);
      } else {
        router.push(`/events/${event.id}/editor`);
      }
    } catch (error) {
      console.error("Failed to clone template:", error);
      setSelectedId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[3/4] animate-shimmer rounded-2xl bg-stone-100" />
        ))}
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template: any) => (
        <motion.div key={template.id} variants={fadeUp}>
          <div
            className={`card-interactive group overflow-hidden ${
              selectedId === template.id ? "ring-2 ring-[var(--color-gold)]" : ""
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
              {template.thumbnailUrl ? (
                <img
                  src={template.thumbnailUrl}
                  alt={template.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <SealSvg size={64} className="text-stone-300" />
                </div>
              )}
              {template.isPremium && (
                <div className="absolute right-3 top-3">
                  <Badge variant="premium" className="gap-1">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900/0 opacity-0 transition-all duration-300 group-hover:bg-stone-900/40 group-hover:opacity-100">
                <div className="flex flex-col items-center gap-2">
                  {selectedId === template.id ? (
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  ) : (
                    <>
                      <div className="rounded-full bg-white p-3 shadow-lg">
                        <ArrowRight className="h-5 w-5 text-stone-900" />
                      </div>
                      <span className="text-sm font-medium text-white">Выбрать шаблон</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-stone-900">{template.name}</h3>
              <p className="mt-1 text-sm text-stone-500">{template.category?.name}</p>
              {template.priceKzt > 0 && (
                <p className="mt-2 text-sm font-semibold text-[var(--color-gold)]">
                  {template.priceKzt.toLocaleString()} ₸
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
