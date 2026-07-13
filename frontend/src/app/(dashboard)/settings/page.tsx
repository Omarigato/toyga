"use client";

import * as React from "react";
import { useAuthStore } from "@/shared/lib/store";
import { api } from "@/shared/api/client";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar } from "@/shared/ui/avatar";
import { useToast } from "@/shared/ui/toast";
import { User, Mail, Phone, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const [name, setName] = React.useState(user?.name || "");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => { if (user) setName(user.name || ""); }, [user]);

  async function save() {
    setIsSaving(true);
    try {
      const data = await api.put<{ name: string }>("/users/me", { name });
      setUser({ ...user!, ...data });
      toast("success", t("settings.saved"));
    } catch { toast("error", t("common.error")); }
    finally { setIsSaving(false); }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">{t("settings.title")}</h1><p className="text-sm text-stone-500">{t("settings.subtitle")}</p></div>
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <Card><CardContent className="flex flex-col items-center p-6">
            <div className="relative">
              <Avatar src={user?.avatarUrl} fallback={user?.name} size="xl" />
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-500"><Camera className="h-4 w-4" /></button>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-stone-500">{user?.email}</p>
            <div className="mt-4 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">{user?.role === "admin" ? t("settings.admin") : t("settings.user")}</div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>{t("settings.profile")}</CardTitle><CardDescription>{t("settings.profileDesc")}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Input label={t("settings.name")} value={name} onChange={(e) => setName(e.target.value)} icon={<User className="h-4 w-4" />} />
              <Input label={t("settings.email")} value={user?.email || ""} disabled icon={<Mail className="h-4 w-4" />} />
              <Input label={t("settings.phone")} value={user?.phone || ""} disabled icon={<Phone className="h-4 w-4" />} />
              <div className="flex items-center gap-3 pt-4"><Button onClick={save} isLoading={isSaving}>{t("settings.save")}</Button></div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
