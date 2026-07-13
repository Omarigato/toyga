import * as React from "react";
import { cn } from "@/lib/cn";

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex h-11 items-center justify-start rounded-lg bg-background-100 p-1 text-foreground-500 w-full overflow-x-auto whitespace-nowrap scrollbar-none sm:w-auto", className)}>
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used inside Tabs");

  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        isActive
          ? "bg-background-50 text-foreground-900 shadow-sm font-semibold"
          : "hover:bg-background-50/50 hover:text-foreground-700",
        className
      )}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used inside Tabs");

  if (context.value !== value) return null;

  return (
    <div className={cn("focus-visible:outline-none focus:outline-none outline-none animate-in fade-in-50 duration-200", className)}>
      {children}
    </div>
  );
}
export { TabsContext }
