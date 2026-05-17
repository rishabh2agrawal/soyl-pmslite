"use client";

import { cn } from "@/lib/utils";
import type { BookingStatus, RoomStatus, RequestStatus } from "@/types";

type StatusColor = {
  bg: string;
  text: string;
  ring?: string;
};

const bookingVariants: Record<BookingStatus, StatusColor> = {
  confirmed: {
    bg: "bg-[var(--status-confirmed-bg)]",
    text: "text-[var(--status-confirmed-text)]",
  },
  checked_in: {
    bg: "bg-[var(--status-checkedin-bg)]",
    text: "text-[var(--status-checkedin-text)]",
    ring: "ring-1 ring-blue-300/65 dark:ring-teal/35",
  },
  checked_out: {
    bg: "bg-[var(--status-checkout-bg)]",
    text: "text-[var(--status-checkout-text)]",
  },
  cancelled: {
    bg: "bg-[var(--status-cancelled-bg)]",
    text: "text-[var(--status-cancelled-text)]",
  },
  no_show: {
    bg: "bg-[var(--status-noshow-bg)]",
    text: "text-[var(--status-noshow-text)]",
  },
};

const roomVariants: Record<RoomStatus, StatusColor> = {
  available: {
    bg: "bg-[var(--room-available-bg)]",
    text: "text-[var(--room-available-text)]",
  },
  occupied: {
    bg: "bg-[var(--room-occupied-bg)]",
    text: "text-[var(--room-occupied-text)]",
  },
  dirty: {
    bg: "bg-[var(--room-dirty-bg)]",
    text: "text-[var(--room-dirty-text)]",
  },
  cleaning: {
    bg: "bg-[var(--room-cleaning-bg)]",
    text: "text-[var(--room-cleaning-text)]",
  },
  maintenance: {
    bg: "bg-[var(--room-maintenance-bg)]",
    text: "text-[var(--room-maintenance-text)]",
  },
  blocked: {
    bg: "bg-[var(--room-blocked-bg)]",
    text: "text-[var(--room-blocked-text)]",
  },
  inspected: {
    bg: "bg-[var(--room-inspected-bg)]",
    text: "text-[var(--room-inspected-text)]",
  },
};

const requestVariants: Record<RequestStatus, StatusColor> = {
  open: {
    bg: "bg-[var(--status-noshow-bg)]",
    text: "text-[var(--status-noshow-text)]",
  },
  in_progress: {
    bg: "bg-[var(--status-confirmed-bg)]",
    text: "text-[var(--status-confirmed-text)]",
  },
  resolved: {
    bg: "bg-[var(--status-checkedin-bg)]",
    text: "text-[var(--status-checkedin-text)]",
  },
  escalated: {
    bg: "bg-[var(--status-cancelled-bg)]",
    text: "text-[var(--status-cancelled-text)]",
  },
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
        "inline-flex items-center rounded-full border border-current/15 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        colors.bg,
        colors.text,
        colors.ring,
        className,
      )}
    >
      {formatLabel(status)}
    </span>
  );
}
