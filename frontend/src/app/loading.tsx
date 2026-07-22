"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 animate-pulse shadow-xl shadow-amber-500/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-[shimmer_1.5s_infinite] rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
        </div>
        <span className="text-xs font-serif font-bold text-amber-400 uppercase tracking-widest">
          TOYGA.KZ
        </span>
      </div>
    </div>
  );
}
