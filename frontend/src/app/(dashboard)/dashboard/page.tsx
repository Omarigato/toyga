"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthStore } from "@/shared/lib/store";
import { useEvents } from "@/shared/lib/queries";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate } from "@/shared/lib/utils";
import { Calendar, Users, FileText, ArrowRight, Plus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t, locale } = useI18n();
  const { data: events, isLoading } = useEvents();
  const recentEvents = events?.slice(0, 5) || [];

  const stats = [
    { label: t("dashboard.events"), value: events?.length || 0, icon: Calendar, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
    { label: t("dashboard.guests"), value: 0, icon: Users, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
    { label: t("dashboard.invitations"), value: 0, icon: FileText, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30" },
    { label: t("dashboard.growth"), value: "+12%", icon: TrendingUp, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold sm:text-3xl">{t("dashboard.greeting")}, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-stone-500">{t("dashboard.subtitle")}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-8 w-16" /></CardContent></Card>)
          : stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-stone-500">{stat.label}</p><p className="mt-1 text-3xl font-bold">{stat.value}</p></div><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}><stat.icon className="h-6 w-6" /></div></div></CardContent></Card>
            </motion.div>
          ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/events"><Card className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/5"><CardContent className="flex items-center justify-between p-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"><Plus className="h-6 w-6" /></div><div><h3 className="font-semibold">{t("dashboard.newEvent")}</h3><p className="text-sm text-stone-500">{t("dashboard.newEventDesc")}</p></div></div><ArrowRight className="h-5 w-5 text-stone-400 transition-transform group-hover:translate-x-1" /></CardContent></Card></Link>
        <Link href="/templates"><Card className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/5"><CardContent className="flex items-center justify-between p-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25"><FileText className="h-6 w-6" /></div><div><h3 className="font-semibold">{t("dashboard.viewTemplates")}</h3><p className="text-sm text-stone-500">{t("dashboard.viewTemplatesDesc")}</p></div></div><ArrowRight className="h-5 w-5 text-stone-400 transition-transform group-hover:translate-x-1" /></CardContent></Card></Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t("dashboard.recentEvents")}</CardTitle><Link href="/events"><Button variant="ghost" size="sm">{t("dashboard.viewAll")} <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-xl" /><div className="flex-1"><Skeleton className="h-4 w-40 mb-2" /><Skeleton className="h-3 w-24" /></div></div>)}</div>
          ) : recentEvents.length === 0 ? (
            <div className="py-12 text-center"><Calendar className="mx-auto h-12 w-12 text-stone-300" /><p className="mt-4 text-stone-500">{t("dashboard.noEvents")}</p><Link href="/events"><Button className="mt-4" size="sm"><Plus className="mr-1 h-4 w-4" /> {t("dashboard.createFirst")}</Button></Link></div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-stone-50 dark:hover:bg-stone-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30"><Calendar className="h-5 w-5" /></div>
                  <div className="flex-1"><p className="font-medium">{event.title}</p><p className="text-sm text-stone-500">{formatDate(event.eventDate, locale)}</p></div>
                  <Badge variant={event.status === "published" ? "success" : "secondary"}>{event.status === "published" ? t("events.published") : t("events.draft")}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
