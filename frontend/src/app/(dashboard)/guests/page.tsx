"use client";

import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { SealSvg } from "@/shared/ui/seal-svg";
import { Users } from "lucide-react";

export default function GuestsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--text-display-md)] font-semibold text-[var(--color-ink)]">{t("nav.guests") || "Гости"}</h1>
        <p className="mt-1 text-[var(--color-steppe)]">Управляйте списком гостей</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <SealSvg size={64} className="mb-4 text-[var(--color-steppe-25)]" />
          <p className="text-[var(--color-steppe)]">Выберите мероприятие для управления гостями</p>
        </CardContent>
      </Card>
    </div>
  );
}
