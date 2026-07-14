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
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch {
      toast(t("auth.registerError") || "Ошибка регистрации", "error");
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
            Создайте приглашение
          </h2>
          <p className="mt-4 text-[var(--color-steppe)]">
            Начните создавать цифровые приглашения для ваших торжеств
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

          <h1 className="text-[var(--text-display-md)] font-semibold text-[var(--color-ink)]">{t("auth.registerTitle") || "Регистрация"}</h1>
          <p className="mt-2 text-sm text-[var(--color-steppe)]">
            {t("auth.registerSubtitle") || "Создайте аккаунт для управления приглашениями"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label={t("auth.name") || "Имя"}
              type="text"
              placeholder="Ваше имя"
              icon={<User className="h-4 w-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label={t("auth.email") || "Email"}
              type="email"
              placeholder="email@example.com"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label={t("auth.password") || "Пароль"}
              type="password"
              placeholder="Минимум 6 символов"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <Button type="submit" size="lg" className="w-full" isLoading={loading}>
              {t("auth.register") || "Зарегистрироваться"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-steppe)]">
            {t("auth.hasAccount") || "Уже есть аккаунт?"}{" "}
            <Link href="/login" className="font-medium text-[var(--color-tengri)] underline-offset-4 hover:underline">
              {t("auth.login") || "Войти"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
