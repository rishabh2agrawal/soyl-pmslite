"use client";

import Image from "next/image";
import { TopBar } from "@/components/layouts/top-bar";
import { BottomNav, type NavItem } from "@/components/layouts/bottom-nav";
import { RoleBadge } from "@/components/layouts/role-badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import {
  CalendarCheck,
  CalendarDays,
  BookOpen,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store";
import { isManagerTabActive } from "@/lib/manager-nav-active";
import { getInitials } from "@/lib/formatters";
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
  const displayName = propertyName || "Property";

  const items: NavItem[] = managerNavItems.map((item) => ({
    href: item.href,
    icon: item.icon,
    label: t(item.labelKey),
  }));

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="surface-card-hover hidden border-r border-border/80 bg-card shadow-sm dark:glass-heavy dark:border-white/[0.06] dark:shadow-none lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-56 lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-border/80 px-5 dark:border-white/[0.06]">
          <Image
            src="/icon.png"
            alt="SOYL"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full"
            priority
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground dark:text-chalk">
              {displayName}
            </p>
            <p className="text-2xs font-medium uppercase tracking-widest text-muted-foreground dark:text-plum">
              Manager
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {items.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </nav>
        <div className="mt-auto space-y-3 border-t border-border/80 px-3 py-4 dark:border-white/[0.06]">
          <SidebarNavItem
            item={{
              href: "/app/settings",
              icon: Settings,
              label: t("settings"),
            }}
          />
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary dark:bg-teal/15 dark:text-teal">
              {getInitials(displayName) || "P"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground dark:text-chalk">
                {displayName}
              </p>
              <p className="text-xs capitalize text-muted-foreground dark:text-plum">
                manager
              </p>
            </div>
            <ThemeToggle compact />
          </div>
          <div className="flex justify-center px-1">
            <LanguageSwitcher compact />
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:hover:bg-white/[0.05]"
          >
            <LogOut className="size-3.5" aria-hidden />
            Log out
          </Link>
        </div>
      </aside>

      <div className="lg:hidden">
        <TopBar
          title={displayName}
          rightAction={<RoleBadge role="manager" />}
        />
      </div>

      <main className="min-h-dvh flex-1 overflow-y-auto lg:pl-56">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-14 lg:mx-0 lg:max-w-[1280px] lg:pb-10 lg:pt-8 xl:px-8">
          {children}
        </div>
      </main>

      <Link
        href="/app/manager/bookings/new"
        className={cn(
          "fixed bottom-20 right-4 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all active:scale-95 lg:hidden",
          "bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/90 dark:bg-teal dark:text-ink dark:shadow-glow dark:hover:bg-chalk",
        )}
        aria-label={t("newBooking")}
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
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "-ml-px border-l-2 border-primary bg-primary/10 pl-[calc(0.75rem-2px)] font-semibold text-primary dark:border-teal dark:bg-teal/10 dark:pl-[calc(0.75rem-2px)] dark:text-teal dark:shadow-none"
          : "border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground dark:text-plum dark:hover:bg-white/[0.04] dark:hover:text-chalk",
      )}
    >
      <item.icon
        className={cn(
          "size-5 shrink-0 transition-all",
          isActive &&
            "text-primary dark:text-teal dark:drop-shadow-[0_0_5px_rgba(175,208,204,0.45)]",
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
