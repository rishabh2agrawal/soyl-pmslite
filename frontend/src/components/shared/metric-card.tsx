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
  up: { icon: TrendingUp, color: "text-teal" },
  down: { icon: TrendingDown, color: "text-destructive" },
  neutral: { icon: Minus, color: "text-plum" },
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
        "liquid-glass glass-hover relative overflow-hidden rounded-2xl p-4 transition-all",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-card-shine opacity-70" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col">
          <span className="text-3xl font-semibold leading-none tracking-tight text-chalk">
            {value}
          </span>
          <span className="mt-1.5 text-xs text-plum">{label}</span>
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
            "flex size-10 items-center justify-center rounded-xl",
            variant === "success" && "bg-teal/12 text-teal",
            variant === "warning" &&
              "bg-[rgba(180,140,60,0.14)] text-[#C9A84C]",
            variant === "danger" &&
              "bg-destructive/12 text-destructive",
            variant === "default" && "bg-plum/20 text-chalk/70",
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
