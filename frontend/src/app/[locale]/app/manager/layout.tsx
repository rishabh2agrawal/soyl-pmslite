"use client";

import Image from "next/image";
import { TopBar } from "@/components/layouts/top-bar";
import { BottomNav, type NavItem } from "@/components/layouts/bottom-nav";
import { RoleBadge } from "@/components/layouts/role-badge";
import {
  CalendarCheck,
  CalendarDays,
  BookOpen,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store";
import { isManagerTabActive } from "@/lib/manager-nav-active";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const managerNavItems = [
  { href: "/app/manager", icon: CalendarCheck, labelKey: "today" },
  { href: "/app/manager/calendar", icon: CalendarDays, labelKey: "calendar" },
  { href: "/app/manager/bookings", icon: BookOpen, labelKey: "bookings" },
  { href: "/app/manager/bookings/new", icon: Plus, labelKey: "newBooking" },
  { href: "/app/manager/requests", icon: MessageSquare, labelKey: "requests" },
  { href: "/app/manager/more", icon: MoreHorizontal, labelKey: "more" },
];

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("nav");
  const propertyName = useAppStore((s) => s.propertyName);

  const items: NavItem[] = managerNavItems.map((item) => ({
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
              {propertyName || "Property"}
            </p>
            <p className="text-2xs font-medium uppercase tracking-widest text-plum">
              Manager
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
          title={propertyName || "Property"}
          rightAction={<RoleBadge role="manager" />}
        />
      </div>

      <main className="min-h-dvh flex-1 overflow-y-auto lg:pl-56">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-14 lg:pb-10 lg:pt-8">
          {children}
        </div>
      </main>

      <Link
        href="/app/manager/bookings/new"
        className="fixed bottom-20 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-teal text-ink shadow-glow transition-all hover:bg-chalk hover:shadow-raised active:scale-95 lg:hidden"
      >
        <Plus className="size-6" />
      </Link>

      <div className="lg:hidden">
        <BottomNav items={items} mode="manager" />
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
  const isActive = isManagerTabActive(pathname, item.href);

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
