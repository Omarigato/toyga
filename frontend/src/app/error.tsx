"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] text-white p-6 font-sans">
      <div className="text-center max-w-md w-full bg-gradient-to-b from-[#1c1c1e] to-[#121214] border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/60 mx-auto flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-white">Қателік орын алды</h1>
          <p className="text-xs text-gray-400">{error?.message || "Произошла непредвиденная ошибка"}</p>
        </div>

        <button
          onClick={reset}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Қайталап көру</span>
        </button>
      </div>
    </div>
  );
}
