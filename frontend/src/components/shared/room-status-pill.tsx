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
  available: "bg-soyl-secondary",
  occupied: "bg-soyl-primary",
  blocked: "bg-soyl-accent",
  maintenance: "bg-soyl-danger",
  dirty: "bg-soyl-accent",
  cleaning: "bg-soyl-secondary",
  inspected: "bg-soyl-secondary",
};

export function RoomStatusPill({ roomNumber, status, onClick, className }: RoomStatusPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-touch items-center gap-2 rounded-full border border-soyl-border/70 bg-white/80 px-3 py-1.5 text-sm font-semibold text-soyl-text shadow-soft transition-colors hover:bg-soyl-bg active:scale-[0.97]",
        className,
      )}
    >
      <span className={cn("size-2.5 rounded-full", statusDotColor[status])} />
      <span>{roomNumber}</span>
    </button>
  );
}
