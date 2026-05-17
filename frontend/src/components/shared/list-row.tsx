"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListRowProps {
  title: string;
  subtitle?: string;
  avatar?: string;
  icon?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListRow({
  title,
  subtitle,
  avatar,
  icon,
  right,
  onClick,
  className,
}: ListRowProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "glass-hover flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
        onClick && "cursor-pointer active:scale-[0.99]",
        className,
      )}
    >
      {(avatar || icon) && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-semibold text-teal ring-1 ring-teal/20">
          {avatar ? (
            <span>{avatar.slice(0, 2).toUpperCase()}</span>
          ) : (
            icon
          )}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold leading-tight text-chalk">
          {title}
        </span>
        {subtitle && (
          <span className="truncate text-xs leading-tight text-plum">
            {subtitle}
          </span>
        )}
      </div>

      {right && <div className="shrink-0">{right}</div>}
    </Comp>
  );
}
