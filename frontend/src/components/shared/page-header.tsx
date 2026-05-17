"use client";

import { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className={cn("flex items-start gap-3 py-4", className)}>
      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label="Go back"
          className="mt-0.5 min-h-touch min-w-touch shrink-0"
        >
          <ArrowLeft className="size-5" />
        </Button>
      )}

      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold text-soyl-text">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-soyl-muted/90">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
