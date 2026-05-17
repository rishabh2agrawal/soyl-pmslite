"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const options = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Monitor, label: "System" },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  if (compact) {
    const current = options.find((o) => o.value === theme) ?? options[0];
    const idx = Math.max(
      0,
      options.findIndex((o) => o.value === current.value),
    );
    const next = options[(idx + 1) % options.length]!;
    const IconCurrent = current.icon;
    return (
      <button
        type="button"
        onClick={() => setTheme(next.value)}
        aria-label={`Theme: ${current.label}. Activate to switch to ${next.label}.`}
        title={`Switch to ${next.label}`}
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-accent/15 hover:text-primary"
      >
        <IconCurrent className="size-4" />
      </button>
    );
  }

  return (
    <div className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
            theme === value
              ? "bg-primary text-primary-foreground shadow-sm dark:bg-teal dark:text-ink"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label={label}
          title={label}
        >
          <Icon className="size-3.5" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
