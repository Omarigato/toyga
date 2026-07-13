import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "Тойға — Цифровые приглашения", template: "%s | Тойға" },
  description: "Создавайте красивые цифровые приглашения для торжеств",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" className="antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Yeseva+One&family=Golos+Text:wght@400;500;600;700&family=PT+Mono&family=Forum&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--color-parchment)] text-[var(--color-ink)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
