import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600"><span className="text-sm font-bold text-white">T</span></div>
              <span className="text-lg font-bold">Той<span className="text-amber-600">ға</span></span>
            </Link>
            <p className="mt-3 text-sm text-stone-500">Digital invitation platform</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link href="/templates" className="hover:text-amber-600">Templates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link href="#" className="hover:text-amber-600">FAQ</Link></li>
              <li><Link href="#" className="hover:text-amber-600">Contacts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link href="#" className="hover:text-amber-600">Privacy</Link></li>
              <li><Link href="#" className="hover:text-amber-600">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-400 dark:border-stone-800">
          © 2026 Тойға
        </div>
      </div>
    </footer>
  );
}
