"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, BellRing } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";

interface NotificationOption {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

const defaultOptions: NotificationOption[] = [
  { key: "new_booking", label: "New Booking", description: "When a new booking is created", enabled: true },
  { key: "check_in", label: "Check-in Reminder", description: "30 min before expected check-in", enabled: true },
  { key: "check_out", label: "Check-out Reminder", description: "Morning of checkout day", enabled: true },
  { key: "request", label: "Request Alerts", description: "When a guest submits a request", enabled: true },
  { key: "day_close", label: "Day Close Reminder", description: "Daily at 10 PM if not closed", enabled: false },
  { key: "payment", label: "Payment Received", description: "When a payment is recorded", enabled: true },
];

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [pushGranted, setPushGranted] = useState(false);
  const [options, setOptions] = useState(defaultOptions);

  function requestPush() {
    setPushGranted(true);
    toast.success("Push notifications enabled");
  }

  function toggle(key: string) {
    setOptions((prev) =>
      prev.map((o) => (o.key === key ? { ...o, enabled: !o.enabled } : o))
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-8"
    >
      <div className="mx-auto max-w-lg px-4">
        <PageHeader
          title="Notifications"
          showBack
          onBack={() => router.back()}
        />

        {!pushGranted && (
          <Card className="mb-6 border-soyl-primary/20 bg-soyl-primary/10 shadow-soft">
            <CardContent className="flex flex-col items-center py-6 text-center">
              <div className="mb-3 rounded-full bg-soyl-primary/10 p-3">
                <BellRing className="size-6 text-soyl-primary" />
              </div>
              <h3 className="text-base font-semibold text-soyl-text">
                Enable Push Notifications
              </h3>
              <p className="mt-1 max-w-xs text-sm text-soyl-muted">
                Stay updated with booking alerts, guest requests, and day close
                reminders in real time.
              </p>
              <Button
                onClick={requestPush}
                className="mt-4 min-h-touch bg-soyl-primary text-white hover:bg-soyl-primary-light"
              >
                Enable Notifications
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {options.map((opt) => (
            <Card key={opt.key} className="border-soyl-border/70 bg-white/80">
              <CardContent className="flex min-h-touch items-center justify-between py-3">
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium text-soyl-text">{opt.label}</p>
                  <p className="text-xs text-soyl-muted">{opt.description}</p>
                </div>
                <Switch checked={opt.enabled} onCheckedChange={() => toggle(opt.key)} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
