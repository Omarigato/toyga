"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownProps {
  targetDate: string | Date;
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, className }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={cn("grid grid-cols-4 gap-3 text-center my-6 max-w-sm mx-auto", className)}>
      {[
        { label: "Күн", value: timeLeft.days },
        { label: "Сағат", value: timeLeft.hours },
        { label: "Минут", value: timeLeft.minutes },
        { label: "Секунд", value: timeLeft.seconds },
      ].map((unit, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center rounded-2xl border border-gold/30 bg-[#1A1A2E]/80 p-3 shadow-lg backdrop-blur-md"
        >
          <span className="text-2xl sm:text-3xl font-bold font-serif text-gold">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};
