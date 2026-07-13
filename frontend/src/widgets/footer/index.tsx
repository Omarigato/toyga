import Link from "next/link";
import { SealSvg } from "@/shared/ui/seal-svg";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-gold-12)] bg-[var(--color-ink)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <SealSvg size={24} className="text-[var(--color-gold)]" />
              <span className="font-body text-lg font-semibold text-[var(--color-parchment)]">Той<span className="text-[var(--color-gold)]">ға</span></span>
            </Link>
            <p className="mt-3 text-sm text-[var(--color-steppe)]">Цифровые приглашения для торжеств</p>
          </div>
          <div>
            <h4 className="mb-3 font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-gold)]">Продукт</h4>
            <ul className="space-y-2 text-sm text-[var(--color-steppe)]">
              <li><Link href="/templates" className="hover:text-[var(--color-parchment)] transition-colors">Шаблоны</Link></li>
              <li><Link href="/register" className="hover:text-[var(--color-parchment)] transition-colors">Начать</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-gold)]">Поддержка</h4>
            <ul className="space-y-2 text-sm text-[var(--color-steppe)]">
              <li><Link href="#" className="hover:text-[var(--color-parchment)] transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-parchment)] transition-colors">Контакты</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-eyebrow text-xs tracking-[0.08em] uppercase text-[var(--color-gold)]">Правовая информация</h4>
            <ul className="space-y-2 text-sm text-[var(--color-steppe)]">
              <li><Link href="#" className="hover:text-[var(--color-parchment)] transition-colors">Конфиденциальность</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-parchment)] transition-colors">Условия</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--color-gold-12)] pt-6 text-center text-sm text-[var(--color-steppe)]">
          © 2026 Тойға
        </div>
      </div>
      {/* Seal watermark */}
      <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.06]">
        <SealSvg size={200} className="text-[var(--color-gold)]" />
      </div>
    </footer>
  );
}
