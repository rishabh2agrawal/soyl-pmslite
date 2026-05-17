"use client";

import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div
        className="mb-5 flex size-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-muted/50 text-muted-foreground shadow-sm dark:bg-white/[0.04]"
        aria-hidden
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground dark:text-chalk">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground dark:text-plum">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          type="button"
          onClick={onAction}
          className="mt-6 min-h-touch"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
