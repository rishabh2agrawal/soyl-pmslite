"use client";

import Image from "next/image";
import { Bell, Settings } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  showNotifications?: boolean;
  showSettings?: boolean;
  rightAction?: React.ReactNode;
}

export function TopBar({
  title,
  showNotifications,
  showSettings,
  rightAction,
}: TopBarProps) {
  return (
    <header className="glass-heavy fixed inset-x-0 top-0 z-40 h-14 border-b border-white/[0.06] safe-area-pt">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/icon.png"
            alt="SOYL"
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-full"
            priority
          />
          <h1 className="truncate text-sm font-semibold tracking-tight text-chalk">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {rightAction}
          {showNotifications && (
            <Link
              href="/app/notifications"
              className={cn(
                "flex size-9 items-center justify-center rounded-xl text-plum transition-all hover:bg-white/[0.05] hover:text-chalk",
              )}
            >
              <Bell className="size-4" />
            </Link>
          )}
          {showSettings && (
            <Link
              href="/app/settings"
              className={cn(
                "flex size-9 items-center justify-center rounded-xl text-plum transition-all hover:bg-white/[0.05] hover:text-chalk",
              )}
            >
              <Settings className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
