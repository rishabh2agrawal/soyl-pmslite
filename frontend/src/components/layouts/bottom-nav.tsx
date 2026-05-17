"use client";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

interface BottomNavProps {
  items: NavItem[];
  mode: "owner" | "manager";
}

export function BottomNav({ items, mode }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-white/80 backdrop-blur-xl safe-area-pb">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/app/owner" &&
              item.href !== "/app/manager" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-[3rem] flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? mode === "owner"
                    ? "text-primary font-semibold"
                    : "text-secondary font-semibold"
                  : "text-muted-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive &&
                    (mode === "owner" ? "text-primary" : "text-secondary"),
                )}
              />
              <span className="leading-tight">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
