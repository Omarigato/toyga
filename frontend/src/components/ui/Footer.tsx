"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/context/i18n-context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-surface text-secondary border-t border-subtle py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <span className="font-serif text-xl font-bold text-primary tracking-tight">
            TOYGA<span className="text-amber-500">.KZ</span>
          </span>
          <span className="text-xs text-secondary">| Luxury Kazakh Digital Invitation SaaS Platform</span>
        </div>

        <div className="text-xs text-secondary">
          &copy; {new Date().getFullYear()} Toyga.kz. Барлық құқықтар қорғалған.
        </div>
      </div>
    </footer>
  );
}
