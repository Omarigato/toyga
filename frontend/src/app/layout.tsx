import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "Тойға — Цифровые приглашения", template: "%s | Тойға" },
  description: "Создавайте красивые цифровые приглашения для торжеств",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" className="antialiased" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
