"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { useToast } from "@/shared/ui/toast";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { SealSvg } from "@/shared/ui/seal-svg";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      toast(t("auth.invalidCredentials") || "Неверные данные", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Decorative panel */}
      <div className="hidden w-1/2 items-center justify-center bg-[var(--color-ink)] p-12 lg:flex">
        <div className="text-center">
          <SealSvg size={120} className="mx-auto mb-8 text-[var(--color-gold)]" />
          <h2 className="font-display text-[var(--text-display-lg)] text-[var(--color-parchment)]">
            Тойғаға қош келдіңіз
          </h2>
          <p className="mt-4 text-[var(--color-steppe)]">
            Цифровые приглашения для ваших торжеств
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <SealSvg size={32} />
            <span className="font-body text-xl font-semibold">Той<span className="text-[var(--color-gold)]">ға</span></span>
          </div>

          <h1 className="text-[var(--text-display-md)] font-semibold text-[var(--color-ink)]">{t("auth.loginTitle") || "Вход в аккаунт"}</h1>
          <p className="mt-2 text-sm text-[var(--color-steppe)]">
            {t("auth.loginSubtitle") || "Введите ваши данные для входа"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label={t("auth.email") || "Email"}
              type="email"
              placeholder="admin@toyga.kz"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label={t("auth.password") || "Пароль"}
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" size="lg" className="w-full" isLoading={loading}>
              {t("auth.login") || "Войти"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-steppe)]">
            {t("auth.noAccount") || "Нет аккаунта?"}{" "}
            <Link href="/register" className="font-medium text-[var(--color-tengri)] underline-offset-4 hover:underline">
              {t("auth.register") || "Зарегистрироваться"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
