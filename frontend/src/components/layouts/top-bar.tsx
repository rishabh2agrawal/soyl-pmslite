"use client";

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
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-soyl-border/70 bg-white/85 px-4 shadow-soft backdrop-blur-xl safe-area-pt">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      <div className="flex items-center gap-1">
        {rightAction}
        {showNotifications && (
          <Link
            href="/app/notifications"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-soyl-bg hover:text-foreground",
            )}
          >
            <Bell className="h-5 w-5" />
          </Link>
        )}
        {showSettings && (
          <Link
            href="/app/settings"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-soyl-bg hover:text-foreground",
            )}
          >
            <Settings className="h-5 w-5" />
          </Link>
        )}
      </div>
    </header>
  );
}
