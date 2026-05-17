"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterChips({ options, activeValue, onChange, className }: FilterChipsProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === activeValue;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "shrink-0 min-h-touch rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-soyl-primary bg-soyl-primary text-white"
                : "border-soyl-border bg-soyl-surface text-soyl-text hover:bg-soyl-bg",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
