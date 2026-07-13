"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/lib/store";
import { useI18n } from "@/shared/i18n/provider";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { useToast } from "@/shared/ui/toast";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast("success", t("auth.createAccount"));
      router.push("/dashboard");
    } catch (err: any) {
      toast("error", err?.response?.data?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-white to-stone-50 px-4 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25"><span className="text-xl font-bold text-white">T</span></div>
            <span className="text-2xl font-bold">Той<span className="text-amber-600">ға</span></span>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("auth.registerTitle")}</CardTitle>
            <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label={t("auth.name")} type="text" placeholder="Akim" value={name} onChange={(e) => setName(e.target.value)} icon={<User className="h-4 w-4" />} required />
              <Input label={t("auth.email")} type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} required />
              <div className="relative">
                <Input label={t("auth.password")} type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="h-4 w-4" />} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-stone-400 hover:text-stone-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>{t("auth.register")}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500">
              {t("auth.hasAccount")} <Link href="/login" className="font-medium text-amber-600 hover:underline">{t("auth.login")}</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
