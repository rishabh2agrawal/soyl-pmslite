"use client";

import { type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between border-b border-white/[0.06] py-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="glass glass-hover flex size-9 items-center justify-center rounded-xl text-plum transition-all hover:text-chalk"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-chalk">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-xs text-plum">{subtitle}</p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
