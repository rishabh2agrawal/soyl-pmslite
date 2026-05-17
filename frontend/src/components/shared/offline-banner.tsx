"use client";

import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineBannerProps {
  isOnline: boolean;
  syncCount: number;
  className?: string;
}

export function OfflineBanner({ isOnline, syncCount, className }: OfflineBannerProps) {
  if (isOnline) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-2 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800",
        className,
      )}
    >
      <WifiOff className="size-4 shrink-0" />
      <span>You&apos;re offline</span>
      {syncCount > 0 && (
        <span className="ml-auto inline-flex size-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
          {syncCount}
        </span>
      )}
    </div>
  );
}
