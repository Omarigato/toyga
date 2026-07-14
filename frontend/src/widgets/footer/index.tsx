import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)]">
                <span className="text-sm font-bold text-white">Т</span>
              </div>
              <span className="font-display text-lg font-semibold text-stone-900">Тойға</span>
            </Link>
            <p className="mt-3 text-sm text-stone-500">Цифровые приглашения для торжеств</p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Категории</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/wedding" className="hover:text-stone-900 transition-colors">Свадьба</Link></li>
              <li><Link href="/qyz-uzaty" className="hover:text-stone-900 transition-colors">Қыз ұзату</Link></li>
              <li><Link href="/sundet-toy" className="hover:text-stone-900 transition-colors">Сүндет той</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Продукт</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/events" className="hover:text-stone-900 transition-colors">Мои мероприятия</Link></li>
              <li><Link href="/templates" className="hover:text-stone-900 transition-colors">Шаблоны</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Правовая информация</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="#" className="hover:text-stone-900 transition-colors">Конфиденциальность</Link></li>
              <li><Link href="#" className="hover:text-stone-900 transition-colors">Условия</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-stone-100 pt-6 text-center text-sm text-stone-400">
          &copy; 2026 Тойға. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
