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
        "fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-soyl-border bg-white px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {secondaryLabel && onSecondary && (
        <Button
          variant="outline"
          onClick={onSecondary}
          disabled={disabled || loading}
          className="min-h-touch flex-1 border-soyl-border text-soyl-text"
        >
          {secondaryLabel}
        </Button>
      )}
      <Button
        onClick={onPrimary}
        disabled={disabled || loading}
        className="min-h-touch flex-1 bg-soyl-primary text-white hover:bg-soyl-primary-light"
      >
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {primaryLabel}
      </Button>
    </div>
  );
}
