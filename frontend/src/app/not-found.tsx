import Link from "next/link";
import { SealSvg } from "@/shared/ui/seal-svg";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] p-6">
      <div className="text-center">
        <SealSvg size={80} className="mx-auto mb-6 text-[var(--color-gold)] opacity-40" />
        <h1 className="font-mono text-[var(--text-display-xl)] font-bold text-[var(--color-parchment)]">404</h1>
        <p className="mt-2 text-[var(--color-steppe)]">Эта страница не найдена</p>
        <Link href="/" className="mt-8 inline-block">
          <Button variant="wine">На главную</Button>
        </Link>
      </div>
    </div>
  );
}
