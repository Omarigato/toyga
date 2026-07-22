"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-[#1A1A2E] rounded-2xl border border-gold/30 text-white shadow-xl backdrop-blur-md", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center px-2",
        caption_label: "text-sm font-semibold font-serif text-gold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border border-gold/30 rounded-full flex items-center justify-center text-gold"
        ),
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-between",
        head_cell: "text-white/40 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2 justify-between",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gold/20 rounded-full flex items-center justify-center transition-colors cursor-pointer text-white"
        ),
        selected: "bg-gradient-to-r from-gold to-[#A68B4B] text-ink font-bold hover:bg-gold shadow-md",
        today: "border border-gold text-gold font-semibold",
        outside: "text-white/20 opacity-50",
        disabled: "text-white/20 opacity-30 cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) => (
          props.orientation === "left" ? (
            <ChevronLeft className="h-4 w-4 text-gold" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gold" />
          )
        )
      }}
      {...props}
    />
  );
}

export { Calendar };
