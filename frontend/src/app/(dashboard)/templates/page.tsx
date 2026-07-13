"use client";

import * as React from "react";
import { useTemplates, useCategories } from "@/shared/lib/queries";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { Search, Star, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function TemplatesPage() {
  const { t } = useI18n();
  const { data: templates, isLoading } = useTemplates();
  const { data: categories } = useCategories();
  const [search, setSearch] = React.useState("");
  const [selectedCat, setSelectedCat] = React.useState<string | null>(null);

  const filtered = templates?.filter((t) => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || t.categoryId === selectedCat;
    return matchSearch && matchCat;
  }) || [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">{t("templates.title")}</h1><p className="text-sm text-stone-500">{t("templates.subtitle")}</p></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><Input placeholder={t("templates.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setSelectedCat(null)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${!selectedCat ? "bg-amber-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400"}`}>{t("templates.all")}</button>
        {categories?.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCat === cat.id ? "bg-amber-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400"}`}>{cat.name}</button>
        ))}
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Card key={i}><Skeleton className="h-64 w-full rounded-t-2xl" /><CardContent className="p-4"><Skeleton className="mb-2 h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center"><Sparkles className="mx-auto h-12 w-12 text-stone-300" /><p className="mt-4 text-lg font-medium">{t("templates.noTemplates")}</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((template, i) => (
            <motion.div key={template.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-amber-500/10">
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50 dark:from-stone-800 dark:to-stone-900">
                  {template.thumbnailUrl ? <img src={template.thumbnailUrl} alt={template.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Sparkles className="h-16 w-16 text-stone-200 dark:text-stone-700" /></div>}
                  {template.isPremium && <div className="absolute left-2 top-2"><Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"><Star className="mr-1 h-3 w-3" /> {t("templates.premium")}</Badge></div>}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20"><Button size="lg" className="translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">{t("templates.select")} <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
                </div>
                <CardContent className="p-4"><h3 className="font-semibold">{template.name}</h3><p className="mt-1 text-sm text-stone-500">{template.category?.name}</p></CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
