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

export function FilterChips({
  options,
  activeValue,
  onChange,
  className,
}: FilterChipsProps) {
  return (
    <div
      className={cn(
        "scrollbar-none flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
              "min-h-touch shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "border-teal/40 bg-teal/10 text-teal"
                : "border-white/[0.07] bg-transparent text-plum hover:border-white/[0.12] hover:text-chalk",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
