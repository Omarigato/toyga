"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export interface TestimonialItem {
  name: string;
  role: string;
  comment: string;
  rating?: number;
  avatar?: string;
}

interface TestimonialsMarqueeProps {
  items: TestimonialItem[];
  className?: string;
}

export const TestimonialsMarquee: React.FC<TestimonialsMarqueeProps> = ({
  items,
  className,
}) => {
  return (
    <div className={cn("relative overflow-hidden py-10 w-full", className)}>
      <div className="flex space-x-6 animate-marquee hover:[animation-play-state:paused] w-max">
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="w-[320px] sm:w-[380px] shrink-0 rounded-2xl border border-gold/30 bg-[#21213B]/90 p-6 text-white shadow-xl backdrop-blur-md transition-all hover:border-gold hover:shadow-gold/10"
          >
            <div className="flex items-center space-x-1 mb-3 text-gold">
              {Array.from({ length: item.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm text-white/90 italic mb-4 line-clamp-3">
              "{item.comment}"
            </p>
            <div className="flex items-center space-x-3 border-t border-white/10 pt-3">
              <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center font-bold text-gold text-xs">
                {item.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                <p className="text-xs text-gold/80">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
