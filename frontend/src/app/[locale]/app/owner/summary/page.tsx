"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Share2,
  Copy,
  CheckCircle2,
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 px-4 pb-8"
    >
      <PageHeader
        title="Daily Summary"
        showBack
        onBack={() => router.back()}
      />

      {/* Summary Card */}
      <Card className="border-soyl-border/70 bg-white/80 shadow-soft">
        <CardContent className="space-y-4 p-5">
          <div className="text-center">
            <h2 className="text-lg font-bold text-soyl-text">
              {propertyName}
            </h2>
            <p className="text-sm text-soyl-muted">
              {formatDate(pulse.date, "EEEE, dd MMM yyyy")}
            </p>
          </div>

          <div className="h-px bg-soyl-border" />

          <div className="grid grid-cols-2 gap-4">
            <SummaryRow
              icon={<Bed className="size-4 text-soyl-secondary" />}
              label="Occupancy"
              value={`${pulse.occupancy.occupied}/${pulse.occupancy.total}`}
              sub={formatPercent(pulse.occupancy.percent)}
            />
            <SummaryRow
              icon={<ArrowDownCircle className="size-4 text-soyl-primary" />}
              label="Check-ins"
              value={String(pulse.today.check_ins)}
            />
            <SummaryRow
              icon={<ArrowUpCircle className="size-4 text-soyl-muted" />}
              label="Check-outs"
              value={String(pulse.today.check_outs)}
            />
            <SummaryRow
              icon={<IndianRupee className="size-4 text-soyl-accent" />}
              label="Earnings"
              value={formatCurrency(pulse.today.earnings)}
            />
            <SummaryRow
              icon={<Bell className="size-4 text-soyl-accent" />}
              label="Open Requests"
              value={String(pulse.attention_count)}
            />
            <SummaryRow
              icon={<Users className="size-4 text-soyl-secondary" />}
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
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-soyl-border text-base font-medium text-soyl-text"
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
        <p className="text-xs text-soyl-muted">{label}</p>
        <p className="text-sm font-semibold text-soyl-text">
          {value}
          {sub && (
            <span className="ml-1 text-xs font-normal text-soyl-muted">
              ({sub})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
