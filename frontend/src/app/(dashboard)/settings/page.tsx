"use client";

import * as React from "react";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { useToast } from "@/shared/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar } from "@/shared/ui/avatar";
import { User, Mail } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { t, locale, setLocale } = useI18n();
  const { toast } = useToast();
  const [name, setName] = React.useState(user?.name || "");

  const handleSave = () => {
    toast("Настройки сохранены", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--text-display-md)] font-semibold text-[var(--color-ink)]">{t("nav.settings") || "Настройки"}</h1>
        <p className="mt-1 text-[var(--color-steppe)]">Управление аккаунтом</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatarUrl} fallback={user?.name} size="xl" />
            <div>
              <p className="font-semibold text-[var(--color-ink)]">{user?.name}</p>
              <p className="text-sm text-[var(--color-steppe)]">{user?.email}</p>
            </div>
          </div>
          <Input label="Имя" icon={<User className="h-4 w-4" />} value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" icon={<Mail className="h-4 w-4" />} value={user?.email || ""} disabled />
          <Button onClick={handleSave}>Сохранить</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Язык</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {(["kk", "ru", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLocale(l)} className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${locale === l ? "bg-[var(--color-gold)] text-[var(--color-ink)]" : "border border-[var(--color-steppe-40)] text-[var(--color-steppe)] hover:border-[var(--color-gold)]"}`}>
                {l === "kk" ? "Қазақша" : l === "ru" ? "Русский" : "English"}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
