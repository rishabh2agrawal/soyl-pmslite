"use client";

import { TopBar } from "@/components/layouts/top-bar";
import { BottomNav } from "@/components/layouts/bottom-nav";
import {
  CalendarCheck,
  CalendarDays,
  BookOpen,
  MessageSquare,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";

const managerNavItems = [
  { href: "/app/manager", icon: CalendarCheck, labelKey: "today" },
  { href: "/app/manager/calendar", icon: CalendarDays, labelKey: "calendar" },
  { href: "/app/manager/bookings", icon: BookOpen, labelKey: "bookings" },
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

  const items = managerNavItems.map((item) => ({
    href: item.href,
    icon: item.icon,
    label: t(item.labelKey),
  }));

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <TopBar
        title={propertyName || "Property"}
        rightAction={
          <Badge variant="secondary" className="text-xs font-medium">
            Manager
          </Badge>
        }
      />
      <main className="flex-1 overflow-y-auto pb-20 pt-14">{children}</main>

      {/* FAB for new booking */}
      <Link
        href="/app/manager/bookings/new"
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
      >
        <Plus className="h-6 w-6" />
      </Link>

      <BottomNav items={items} mode="manager" />
    </div>
  );
}
