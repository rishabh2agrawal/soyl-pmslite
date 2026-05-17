"use client";

import { type ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardVariant = "default" | "success" | "warning" | "danger";
type TrendDirection = "up" | "down" | "neutral";

interface MetricCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  trend?: {
    direction: TrendDirection;
    delta: string;
  };
  variant?: MetricCardVariant;
  className?: string;
}

const variantStyles: Record<MetricCardVariant, string> = {
  default: "bg-white/80",
  success: "bg-soyl-secondary/10",
  warning: "bg-soyl-accent/10",
  danger: "bg-soyl-danger/10",
};

const trendConfig: Record<TrendDirection, { icon: typeof TrendingUp; color: string }> = {
  up: { icon: TrendingUp, color: "text-soyl-secondary" },
  down: { icon: TrendingDown, color: "text-soyl-danger" },
  neutral: { icon: Minus, color: "text-soyl-muted" },
};

export function MetricCard({
  icon,
  value,
  label,
  trend,
  variant = "default",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn(variantStyles[variant], "border-soyl-border/70", className)}>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-3xl font-semibold text-soyl-text">{value}</span>
          <span className="text-sm text-soyl-muted/90">{label}</span>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trendConfig[trend.direction].color,
              )}
            >
              {(() => {
                const TrendIcon = trendConfig[trend.direction].icon;
                return <TrendIcon className="size-3.5" />;
              })()}
              <span>{trend.delta}</span>
            </div>
          )}
        </div>
        <div className="rounded-xl bg-white/80 p-2.5 text-soyl-primary shadow-soft">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
