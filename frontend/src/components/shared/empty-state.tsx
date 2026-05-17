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
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      <div className="mb-4 text-soyl-muted">{icon}</div>
      <h3 className="text-lg font-semibold text-soyl-text">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-soyl-muted">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-6 min-h-touch bg-soyl-primary text-white hover:bg-soyl-primary-light"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
