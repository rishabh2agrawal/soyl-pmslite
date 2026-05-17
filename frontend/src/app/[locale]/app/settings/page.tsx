"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  BedDouble,
  Receipt,
  Users,
  Globe,
  Palette,
  Bell,
  ChevronRight,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ROOMS, STAFF } from "@/lib/mock-data";
import type { StaffMember, NotificationSetting } from "@/types";

const defaultNotifications: NotificationSetting[] = [
  { type: "New booking", enabled: true },
  { type: "Check-in reminder", enabled: true },
  { type: "Check-out reminder", enabled: true },
  { type: "Request alerts", enabled: true },
  { type: "Day close reminder", enabled: false },
  { type: "Payment received", enabled: true },
];

export default function SettingsPage() {
  const t = useTranslations("settings");
  const [propertyName, setPropertyName] = useState("SOYL Residency");
  const [address, setAddress] = useState("123 MG Road, Bangalore 560001");
  const [gstin, setGstin] = useState("29ABCDE1234F1Z5");
  const [phone, setPhone] = useState("+91 80 4567 8900");
  const [gstEnabled, setGstEnabled] = useState(true);
  const [defaultTaxRate, setDefaultTaxRate] = useState("12");
  const [staff, setStaff] = useState<StaffMember[]>(STAFF);
  const [notifications, setNotifications] = useState(defaultNotifications);

  function toggleNotification(index: number) {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  }

  function removeStaff(id: string) {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    toast.success("Staff member removed");
  }

  const roomSummary = ROOMS.reduce(
    (acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <motion.div
      {...pageTransitionProps}
      className="pb-8"
    >
      <div className="mx-auto max-w-2xl px-4">
        <PageHeader title={t("title")} />

        <div className="space-y-4">
          {/* Appearance */}
          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="size-4 shrink-0 text-primary" aria-hidden />
                {t("appearance")}
              </CardTitle>
              <CardDescription>{t("appearanceDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium text-foreground">{t("themeLabel")}</p>
              <ThemeToggle />
            </CardContent>
          </Card>

          {/* Property Profile */}
          <Card className="border-white/[0.06] bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4 text-primary" />
                Property Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Property Name</Label>
                <Input id="name" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} className="min-h-touch" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="min-h-touch" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gstin_prop">GSTIN</Label>
                <Input id="gstin_prop" value={gstin} onChange={(e) => setGstin(e.target.value)} className="min-h-touch" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="min-h-touch" />
              </div>
            </CardContent>
          </Card>

          {/* Rooms & Rates */}
          <Card className="border-white/[0.06] bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BedDouble className="size-4 text-primary" />
                Rooms & Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {Object.entries(roomSummary)
                  .map(([type, count]) => `${count} ${type}`)
                  .join(", ")}{" "}
                — {ROOMS.length} total
              </p>
              <div className="flex gap-3">
                <Link href="settings/rooms" className="flex-1">
                  <Button variant="outline" className="min-h-touch w-full justify-between border-white/[0.06] bg-white/80 text-foreground">
                    Manage Rooms <ChevronRight className="size-4" />
                  </Button>
                </Link>
                <Link href="settings/rates" className="flex-1">
                  <Button variant="outline" className="min-h-touch w-full justify-between border-white/[0.06] bg-white/80 text-foreground">
                    Manage Rates <ChevronRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Tax (GST) */}
          <Card className="border-white/[0.06] bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Receipt className="size-4 text-primary" />
                Tax (GST)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="gst_toggle">GST Enabled</Label>
                <Switch id="gst_toggle" checked={gstEnabled} onCheckedChange={setGstEnabled} />
              </div>
              {gstEnabled && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="gstin_tax">GSTIN</Label>
                    <Input id="gstin_tax" value={gstin} onChange={(e) => setGstin(e.target.value)} className="min-h-touch" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tax_rate">Default Tax Rate (%)</Label>
                    <Input id="tax_rate" type="number" value={defaultTaxRate} onChange={(e) => setDefaultTaxRate(e.target.value)} className="min-h-touch" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Staff */}
          <Card className="border-white/[0.06] bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-primary" />
                Staff
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {staff.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg bg-navy-500/70 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove staff ${s.name}`}
                    onClick={() => removeStaff(s.id)}
                    className="size-9 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => toast.info("Add manager flow coming soon")}
                className="min-h-touch w-full gap-2 border-white/[0.06] bg-white/80 text-foreground"
              >
                <Plus className="size-4" /> Add Manager
              </Button>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="size-4 shrink-0 text-primary" aria-hidden />
                {t("language")}
              </CardTitle>
              <CardDescription>{t("languageDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcher />
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4 shrink-0 text-primary" aria-hidden />
                {t("notifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {notifications.map((n, i) => (
                <div key={n.type} className="flex min-h-touch items-center justify-between py-1">
                  <span className="text-sm text-foreground">{n.type}</span>
                  <Switch checked={n.enabled} onCheckedChange={() => toggleNotification(i)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
