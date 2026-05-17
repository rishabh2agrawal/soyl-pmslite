"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function StickyCTA({
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  disabled = false,
  loading = false,
  className,
}: StickyCTAProps) {
  return (
    <div
      className={cn(
        "glass-heavy fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-white/[0.06] px-4 py-3 safe-area-pb",
        className,
      )}
    >
      {secondaryLabel && onSecondary && (
        <Button
          variant="outline"
          onClick={onSecondary}
          disabled={disabled || loading}
          className="min-h-touch flex-1 border-white/[0.12] bg-white/[0.03] text-chalk hover:bg-white/[0.07]"
        >
          {secondaryLabel}
        </Button>
      )}
      <button
        type="button"
        onClick={onPrimary}
        disabled={disabled || loading}
        className={cn(
          "min-h-touch flex h-12 w-full flex-1 items-center justify-center rounded-xl text-sm font-semibold shadow-glow transition-all duration-200",
          "bg-teal text-ink hover:bg-chalk hover:shadow-raised active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
        )}
      >
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {primaryLabel}
      </button>
    </div>
  );
}
