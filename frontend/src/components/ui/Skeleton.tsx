"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded-2xl ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 animate-pulse">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-1/4 rounded-full" />
      </div>
    </div>
  );
}
