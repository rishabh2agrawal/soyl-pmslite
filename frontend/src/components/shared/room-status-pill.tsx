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
  available: "bg-green-500",
  occupied: "bg-blue-500",
  blocked: "bg-orange-500",
  maintenance: "bg-red-500",
  dirty: "bg-yellow-500",
  cleaning: "bg-purple-500",
  inspected: "bg-teal-500",
};

export function RoomStatusPill({ roomNumber, status, onClick, className }: RoomStatusPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-touch items-center gap-2 rounded-full border border-soyl-border bg-soyl-surface px-3 py-1.5 text-sm font-medium text-soyl-text transition-colors hover:bg-soyl-bg active:scale-[0.97]",
        className,
      )}
    >
      <span className={cn("size-2.5 rounded-full", statusDotColor[status])} />
      <span>{roomNumber}</span>
    </button>
  );
}
