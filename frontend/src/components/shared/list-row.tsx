"use client";

import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
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
        "group flex min-h-[52px] w-full cursor-default items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-left shadow-sm transition-all hover:bg-muted/50 dark:border-white/[0.06] dark:bg-transparent dark:shadow-none dark:hover:bg-white/[0.04]",
        onClick && "cursor-pointer active:scale-[0.99]",
        className,
      )}
    >
      {(avatar || icon) && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shadow-sm ring-1 ring-primary/10 dark:bg-teal/10 dark:text-teal dark:ring-teal/20">
          {avatar ? (
            <span>{avatar.slice(0, 2).toUpperCase()}</span>
          ) : (
            icon
          )}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold leading-tight text-foreground dark:text-chalk">
          {title}
        </span>
        {subtitle && (
          <span className="truncate text-xs leading-tight text-muted-foreground dark:text-plum">
            {subtitle}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {right}
        {onClick && (
          <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 dark:text-plum dark:opacity-60 dark:group-hover:opacity-100" />
        )}
      </div>
    </Comp>
  );
}
