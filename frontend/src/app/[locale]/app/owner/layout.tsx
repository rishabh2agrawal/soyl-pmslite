"use client";

import { TopBar } from "@/components/layouts/top-bar";
import { BottomNav } from "@/components/layouts/bottom-nav";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

  const items = ownerNavItems.map((item) => ({
    href: item.href,
    icon: item.icon,
    label: t(item.labelKey),
  }));

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <TopBar title="SOYL" showNotifications showSettings />
      <main className="flex-1 overflow-y-auto pb-20 pt-14">{children}</main>
      <BottomNav items={items} mode="owner" />
    </div>
  );
}
