"use client";

import { cn } from "@/lib/utils";
import type { BookingStatus, RoomStatus, RequestStatus } from "@/types";

type StatusColor = {
  bg: string;
  text: string;
};

const bookingVariants: Record<BookingStatus, StatusColor> = {
  confirmed: { bg: "bg-soyl-secondary/15", text: "text-soyl-secondary" },
  checked_in: { bg: "bg-soyl-secondary/20", text: "text-soyl-secondary" },
  checked_out: { bg: "bg-soyl-border/40", text: "text-soyl-muted" },
  cancelled: { bg: "bg-soyl-danger/15", text: "text-soyl-danger" },
  no_show: { bg: "bg-soyl-accent/20", text: "text-soyl-accent" },
};

const roomVariants: Record<RoomStatus, StatusColor> = {
  available: { bg: "bg-soyl-secondary/15", text: "text-soyl-secondary" },
  occupied: { bg: "bg-soyl-primary/15", text: "text-soyl-primary" },
  blocked: { bg: "bg-soyl-accent/20", text: "text-soyl-accent" },
  maintenance: { bg: "bg-soyl-danger/15", text: "text-soyl-danger" },
  dirty: { bg: "bg-soyl-accent/15", text: "text-soyl-accent" },
  cleaning: { bg: "bg-soyl-secondary/10", text: "text-soyl-secondary" },
  inspected: { bg: "bg-soyl-secondary/20", text: "text-soyl-secondary" },
};

const requestVariants: Record<RequestStatus, StatusColor> = {
  open: { bg: "bg-soyl-accent/20", text: "text-soyl-accent" },
  in_progress: { bg: "bg-soyl-primary/15", text: "text-soyl-primary" },
  resolved: { bg: "bg-soyl-secondary/15", text: "text-soyl-secondary" },
  escalated: { bg: "bg-soyl-danger/15", text: "text-soyl-danger" },
};

type StatusBadgeProps =
  | { domain: "booking"; status: BookingStatus; className?: string }
  | { domain: "room"; status: RoomStatus; className?: string }
  | { domain: "request"; status: RequestStatus; className?: string };

const variantMaps = {
  booking: bookingVariants,
  room: roomVariants,
  request: requestVariants,
} as const;

function formatLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusBadge(props: StatusBadgeProps) {
  const { domain, status, className } = props;
  const colors = (variantMaps[domain] as Record<string, StatusColor>)[status];

  if (!colors) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.02em]",
        colors.bg,
        colors.text,
        className,
      )}
    >
      {formatLabel(status)}
    </span>
  );
}
