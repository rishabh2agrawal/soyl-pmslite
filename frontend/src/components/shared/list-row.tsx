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
        "flex w-full min-h-touch items-center gap-3 rounded-[0.625rem] border border-transparent px-3 py-2.5 text-left transition-colors",
        onClick &&
          "cursor-pointer hover:border-soyl-border/60 hover:bg-white/70 active:bg-soyl-border/30",
        className,
      )}
    >
      {/* Avatar or icon */}
      {(avatar || icon) && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-soyl-primary/10 text-sm font-semibold text-soyl-primary">
          {avatar ? (
            <span>{avatar.slice(0, 2).toUpperCase()}</span>
          ) : (
            icon
          )}
        </div>
      )}

      {/* Center content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-soyl-text">{title}</span>
        {subtitle && (
          <span className="truncate text-xs text-soyl-muted">{subtitle}</span>
        )}
      </div>

      {/* Right slot */}
      {right && <div className="shrink-0 text-xs text-soyl-muted">{right}</div>}
    </Comp>
  );
}
