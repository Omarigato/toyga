import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "Тойға — Цифровые приглашения", template: "%s | Тойға" },
  description: "Создавайте красивые цифровые приглашения для торжеств",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Тойға — Цифровые приглашения",
    description: "Создавайте красивые цифровые приглашения для торжеств",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" className="antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=PT+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
