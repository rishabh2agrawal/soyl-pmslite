"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Share2,
  Copy,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  IndianRupee,
  Bell,
  Bed,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { PULSE_DATA } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent, formatDate } from "@/lib/formatters";

export default function SummaryPage() {
  const router = useRouter();
  const propertyName = useAppStore((s) => s.propertyName) || "SOYL Hotel";
  const pulse = PULSE_DATA;

  const summaryText = [
    `📋 Daily Summary — ${propertyName}`,
    `📅 ${formatDate(pulse.date, "dd MMM yyyy")}`,
    ``,
    `🏨 Occupancy: ${pulse.occupancy.occupied}/${pulse.occupancy.total} rooms (${formatPercent(pulse.occupancy.percent)})`,
    `⬇️ Check-ins: ${pulse.today.check_ins}`,
    `⬆️ Check-outs: ${pulse.today.check_outs}`,
    `💰 Earnings: ${formatCurrency(pulse.today.earnings)}`,
    `🔔 Open requests: ${pulse.attention_count}`,
    `👥 In-house guests: ${pulse.in_house_count}`,
  ].join("\n");

  const handleWhatsApp = useCallback(() => {
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  }, [summaryText]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      // Fallback: no-op
    }
  }, [summaryText]);

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-6 px-4 pb-8"
    >
      <PageHeader
        title="Daily Summary"
        showBack
        onBack={() => router.back()}
      />

      {/* Summary Card */}
      <Card className="border-white/[0.06] bg-white/80 shadow-soft">
        <CardContent className="space-y-4 p-5">
          <div className="text-center">
            <h2 className="text-lg font-bold text-foreground">
              {propertyName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatDate(pulse.date, "EEEE, dd MMM yyyy")}
            </p>
          </div>

          <div className="h-px bg-border" />

          <div className="grid grid-cols-2 gap-4">
            <SummaryRow
              icon={<Bed className="size-4 text-emerald-light" />}
              label="Occupancy"
              value={`${pulse.occupancy.occupied}/${pulse.occupancy.total}`}
              sub={formatPercent(pulse.occupancy.percent)}
            />
            <SummaryRow
              icon={<ArrowDownCircle className="size-4 text-primary" />}
              label="Check-ins"
              value={String(pulse.today.check_ins)}
            />
            <SummaryRow
              icon={<ArrowUpCircle className="size-4 text-muted-foreground" />}
              label="Check-outs"
              value={String(pulse.today.check_outs)}
            />
            <SummaryRow
              icon={<IndianRupee className="size-4 text-amber-light" />}
              label="Earnings"
              value={formatCurrency(pulse.today.earnings)}
            />
            <SummaryRow
              icon={<Bell className="size-4 text-amber-light" />}
              label="Open Requests"
              value={String(pulse.attention_count)}
            />
            <SummaryRow
              icon={<Users className="size-4 text-emerald-light" />}
              label="In-house"
              value={String(pulse.in_house_count)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Share Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleWhatsApp}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-base font-semibold text-white hover:bg-[#20bd5a]"
        >
          <Share2 className="size-5" />
          Share on WhatsApp
        </Button>

        <Button
          variant="outline"
          onClick={handleCopy}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-border text-base font-medium text-foreground"
        >
          <Copy className="size-5" />
          Copy to clipboard
        </Button>
      </div>

      <div className="pb-4" />
    </motion.div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          {value}
          {sub && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              ({sub})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
