"use client";

import { SealSvg } from "@/shared/ui/seal-svg";
import { Button } from "@/shared/ui/button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] p-6">
      <div className="text-center">
        <SealSvg size={80} className="mx-auto mb-6 text-[var(--color-wine)] opacity-60" />
        <h1 className="text-[var(--text-display-md)] font-semibold text-[var(--color-parchment)]">Что-то пошло не так</h1>
        <p className="mt-2 text-[var(--color-steppe)]">{error?.message || "Произошла непредвиденная ошибка"}</p>
        <Button variant="wine" onClick={reset} className="mt-8">
          Попробовать снова
        </Button>
      </div>
    </div>
  );
}
