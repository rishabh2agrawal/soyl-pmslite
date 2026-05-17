"use client";

import { type ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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

const trendConfig: Record<
  TrendDirection,
  { icon: typeof TrendingUp; color: string }
> = {
  up: { icon: TrendingUp, color: "text-emerald-600 dark:text-teal" },
  down: { icon: TrendingDown, color: "text-destructive" },
  neutral: { icon: Minus, color: "text-muted-foreground dark:text-plum" },
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
    <div
      className={cn(
        "surface-card-hover relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        "border-border/70 bg-card shadow-sm dark:liquid-glass dark:border-transparent",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-card-shine opacity-60 dark:opacity-70" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col">
          <span className="text-2xl font-bold leading-none tracking-tight text-foreground dark:text-chalk">
            {value}
          </span>
          <span className="mt-1.5 text-xs text-muted-foreground dark:text-plum">{label}</span>
          {trend && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-xs font-medium",
                trendConfig[trend.direction].color,
              )}
            >
              {(() => {
                const TrendIcon = trendConfig[trend.direction].icon;
                return <TrendIcon className="size-3" />;
              })()}
              <span>{trend.delta}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10 dark:ring-0",
            variant === "success" && "bg-teal/12 text-teal dark:bg-teal/15",
            variant === "warning" &&
              "bg-[#C9A84C]/12 text-[#b8860f] dark:bg-[rgba(180,140,60,0.14)] dark:text-[#C9A84C]",
            variant === "danger" &&
              "bg-destructive/12 text-destructive dark:bg-destructive/15",
            variant === "default" && "dark:bg-plum/20 dark:text-chalk/80 dark:shadow-none",
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
