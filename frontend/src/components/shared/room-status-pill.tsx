"use client";

import { cn } from "@/lib/utils";
import type { RoomStatus } from "@/types";

interface RoomStatusPillProps {
  roomNumber: string;
  status: RoomStatus;
  onClick?: () => void;
  className?: string;
}

const statusDotColor: Record<RoomStatus, string> = {
  available: "bg-secondary",
  occupied: "bg-primary",
  blocked: "bg-amber",
  maintenance: "bg-destructive",
  dirty: "bg-amber",
  cleaning: "bg-secondary",
  inspected: "bg-secondary",
};

export function RoomStatusPill({ roomNumber, status, onClick, className }: RoomStatusPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-touch items-center gap-2 rounded-full border border-white/[0.06] bg-white/80 px-3 py-1.5 text-sm font-semibold text-foreground shadow-soft transition-colors hover:bg-muted active:scale-[0.97]",
        className,
      )}
    >
      <span className={cn("size-2.5 rounded-full", statusDotColor[status])} />
      <span>{roomNumber}</span>
    </button>
  );
}
