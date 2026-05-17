"use client";

import { cn } from "@/lib/utils";
import type { BookingStatus, RoomStatus, RequestStatus } from "@/types";

type StatusColor = {
  bg: string;
  text: string;
};

const bookingVariants: Record<BookingStatus, StatusColor> = {
  confirmed: { bg: "bg-blue-100", text: "text-blue-700" },
  checked_in: { bg: "bg-green-100", text: "text-green-700" },
  checked_out: { bg: "bg-gray-100", text: "text-gray-600" },
  cancelled: { bg: "bg-red-100", text: "text-red-700" },
  no_show: { bg: "bg-orange-100", text: "text-orange-700" },
};

const roomVariants: Record<RoomStatus, StatusColor> = {
  available: { bg: "bg-green-100", text: "text-green-700" },
  occupied: { bg: "bg-blue-100", text: "text-blue-700" },
  blocked: { bg: "bg-orange-100", text: "text-orange-700" },
  maintenance: { bg: "bg-red-100", text: "text-red-700" },
  dirty: { bg: "bg-yellow-100", text: "text-yellow-700" },
  cleaning: { bg: "bg-purple-100", text: "text-purple-700" },
  inspected: { bg: "bg-teal-100", text: "text-teal-700" },
};

const requestVariants: Record<RequestStatus, StatusColor> = {
  open: { bg: "bg-orange-100", text: "text-orange-700" },
  in_progress: { bg: "bg-blue-100", text: "text-blue-700" },
  resolved: { bg: "bg-green-100", text: "text-green-700" },
  escalated: { bg: "bg-red-100", text: "text-red-700" },
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text,
        className,
      )}
    >
      {formatLabel(status)}
    </span>
  );
}
