"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn("w-full overflow-x-auto py-4 no-scrollbar", className)}>
      <div className="flex items-center space-x-2 min-w-max px-2">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "flex items-center space-x-2.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer select-none",
                  isCurrent &&
                    "bg-gradient-to-r from-gold to-[#A68B4B] text-ink shadow-md shadow-gold/20 scale-105",
                  isCompleted &&
                    "bg-teal/20 text-teal-300 border border-teal/40 hover:bg-teal/30",
                  !isCurrent &&
                    !isCompleted &&
                    "bg-[#252542] text-white/50 border border-white/10 hover:text-white hover:border-white/30"
                )}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    isCurrent && "bg-ink text-gold",
                    isCompleted && "bg-teal-400 text-ink",
                    !isCurrent && !isCompleted && "bg-white/10 text-white/70"
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : step.id}
                </div>
                <span className="whitespace-nowrap">{step.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4 rounded-full transition-colors",
                    isCompleted ? "bg-teal/50" : "bg-white/10"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
