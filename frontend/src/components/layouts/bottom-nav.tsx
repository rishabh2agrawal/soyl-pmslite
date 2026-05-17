"use client";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { isManagerTabActive } from "@/lib/manager-nav-active";
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
    <nav className="glass-heavy safe-area-pb fixed inset-x-0 bottom-0 z-40 border-t-0">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {items.map((item) => {
          const isActive =
            mode === "manager"
              ? isManagerTabActive(pathname, item.href)
              : pathname === item.href ||
                (item.href !== "/app/owner" &&
                  item.href !== "/app/manager" &&
                  pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-[3rem] flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all duration-200",
                isActive
                  ? "bg-teal/10 text-teal"
                  : "text-plum hover:bg-white/[0.04] hover:text-chalk",
              )}
            >
              <item.icon
                className={cn(
                  "size-[18px] transition-all",
                  isActive &&
                    "drop-shadow-[0_0_6px_rgba(175,208,204,0.55)]",
                )}
              />
              <span className="leading-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-teal" />
              )}
              {item.badge != null && item.badge > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
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
