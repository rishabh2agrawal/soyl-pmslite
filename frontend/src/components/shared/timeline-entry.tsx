"use client";

import {
  CalendarPlus,
  LogIn,
  LogOut,
  Bell,
  CreditCard,
  XCircle,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/types";

const eventConfig: Record<
  TimelineEvent["type"],
  { icon: typeof CalendarPlus; color: string; bg: string }
> = {
  booking: { icon: CalendarPlus, color: "text-blue-600", bg: "bg-blue-100" },
  check_in: { icon: LogIn, color: "text-emerald-light", bg: "bg-green-100" },
  check_out: { icon: LogOut, color: "text-gray-600", bg: "bg-gray-100" },
  request: { icon: Bell, color: "text-orange-600", bg: "bg-orange-100" },
  payment: { icon: CreditCard, color: "text-amber-light", bg: "bg-yellow-100" },
  cancellation: { icon: XCircle, color: "text-destructive", bg: "bg-red-100" },
  room_change: { icon: ArrowRightLeft, color: "text-purple-600", bg: "bg-purple-100" },
};

interface TimelineEntryProps {
  event: TimelineEvent;
  isLast?: boolean;
  className?: string;
}

export function TimelineEntry({ event, isLast = false, className }: TimelineEntryProps) {
  const config = eventConfig[event.type];
  const Icon = config.icon;

  return (
    <div className={cn("relative flex gap-3", className)}>
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
          config.bg,
          config.color,
        )}
      >
        <Icon className="size-4" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <p className="text-sm font-medium text-foreground">{event.summary}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{event.actor}</span>
          <span>·</span>
          <time dateTime={event.timestamp}>
            {new Date(event.timestamp).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </div>
    </div>
  );
}
