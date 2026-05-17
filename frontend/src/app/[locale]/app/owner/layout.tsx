"use client";

import Image from "next/image";
import { TopBar } from "@/components/layouts/top-bar";
import { BottomNav, type NavItem } from "@/components/layouts/bottom-nav";
import { RoleBadge } from "@/components/layouts/role-badge";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CalendarDays,
  BarChart3,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const ownerNavItems = [
  { href: "/app/owner", icon: Activity, labelKey: "pulse" },
  { href: "/app/owner/attention", icon: AlertTriangle, labelKey: "attention" },
  { href: "/app/owner/story", icon: BookOpen, labelKey: "story" },
  { href: "/app/owner/week", icon: CalendarDays, labelKey: "week" },
  { href: "/app/owner/summary", icon: BarChart3, labelKey: "summary" },
];

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("nav");
  const propertyName = useAppStore((s) => s.propertyName);

  const items: NavItem[] = ownerNavItems.map((item) => ({
    href: item.href,
    icon: item.icon,
    label: t(item.labelKey),
  }));

  return (
    <div className="flex min-h-dvh bg-background">
      <aside
        className="glass-heavy hidden border-r border-white/[0.06] lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-56 lg:flex-col"
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
          <Image
            src="/icon.png"
            alt="SOYL"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full"
            priority
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-chalk">
              {propertyName || "SOYL"}
            </p>
            <p className="text-2xs font-medium uppercase tracking-widest text-plum">
              Owner
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {items.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </nav>
        <div className="space-y-0.5 border-t border-white/[0.06] px-3 py-4">
          <SidebarNavItem
            item={{
              href: "/app/settings",
              icon: Settings,
              label: "Settings",
            }}
          />
        </div>
      </aside>

      <div className="lg:hidden">
        <TopBar
          title={propertyName || "SOYL"}
          showNotifications
          showSettings
          rightAction={<RoleBadge role="owner" />}
        />
      </div>

      <main className="min-h-dvh flex-1 overflow-y-auto lg:pl-56">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-14 lg:pb-10 lg:pt-8">
          {children}
        </div>
      </main>

      <div className="lg:hidden">
        <BottomNav items={items} mode="owner" />
      </div>
    </div>
  );
}

function SidebarNavItem({
  item,
}: {
  item: { href: string; icon: LucideIcon; label: string; badge?: number };
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/app/manager" &&
      item.href !== "/app/owner" &&
      pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "border border-teal/20 bg-teal/10 text-teal shadow-[inset_0_0_0_1px_rgba(175,208,204,0.12)]"
          : "border border-transparent text-plum hover:bg-white/[0.04] hover:text-chalk",
      )}
    >
      <item.icon
        className={cn(
          "size-5 transition-all",
          isActive && "drop-shadow-[0_0_5px_rgba(175,208,204,0.5)]",
        )}
      />
      <span>{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive/90 px-1.5 text-[10px] font-semibold text-white">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );
}
