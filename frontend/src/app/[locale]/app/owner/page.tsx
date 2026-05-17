"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  BedDouble,
  IndianRupee,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Plus,
  CalendarDays,
  MessageSquare,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ListRow } from "@/components/shared/list-row";
import { PULSE_DATA } from "@/lib/mock-data";
import {
  formatCurrency,
  formatPercent,
  getGreeting,
  getInitials,
  formatDate,
} from "@/lib/formatters";
import { useAppStore } from "@/lib/store";
import { pageTransitionProps, stagger, staggerItem } from "@/lib/motion";
import type { BookingStatus } from "@/types";

const today = new Date().toISOString().split("T")[0];

const metricSlots = (
  pulse: typeof PULSE_DATA,
): {
  icon: React.ReactElement;
  value: string;
  label: string;
  variant: "success" | "default";
}[] => [
  {
    icon: <BedDouble className="size-5" />,
    value: `${pulse.occupancy.occupied}/${pulse.occupancy.total}`,
    label: `${formatPercent(pulse.occupancy.percent)} occupied`,
    variant: "success",
  },
  {
    icon: <IndianRupee className="size-5" />,
    value: formatCurrency(pulse.today.earnings),
    label: "Today's earnings",
    variant: "default",
  },
  {
    icon: <ArrowDownCircle className="size-5" />,
    value: String(pulse.today.check_ins),
    label: "Check-ins",
    variant: "default",
  },
  {
    icon: <ArrowUpCircle className="size-5" />,
    value: String(pulse.today.check_outs),
    label: "Check-outs",
    variant: "default",
  },
];

export default function OwnerPulsePage() {
  const propertyName = useAppStore((s) => s.propertyName);
  const pulse = PULSE_DATA;
  const tiles = metricSlots(pulse);

  return (
    <motion.div {...pageTransitionProps} className="space-y-6 pb-8">
      <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-5 lg:space-y-0">
        <div className="space-y-6">
          <div className="pt-2">
            <h2 className="text-3xl font-semibold tracking-tight text-gradient">
              {getGreeting()}
              {propertyName ? `, ${propertyName}` : ""}
            </h2>
            <p className="text-sm text-plum">
              {formatDate(today, "EEEE, dd MMMM yyyy")}
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {tiles.map((m, i) => (
              <motion.div key={`${m.label}-${i}`} variants={staggerItem}>
                <MetricCard {...m} />
              </motion.div>
            ))}
          </motion.div>

          {pulse.attention_count > 0 && (
            <Link href="/app/owner/attention">
              <div className="liquid-glass hover:shadow-[0_0_20px_rgba(201,168,76,0.12)] rounded-2xl border-l-2 border-l-[#C9A84C] p-4 transition-all">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber/25 p-2">
                    <AlertTriangle className="size-5 text-amber-light" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-chalk">
                      {pulse.attention_count} items need attention
                    </p>
                    {pulse.attention_overdue > 0 && (
                      <p className="text-sm font-medium text-destructive">
                        {pulse.attention_overdue} overdue
                      </p>
                    )}
                  </div>
                  <Badge className="border border-amber/40 bg-amber/20 text-chalk">
                    {pulse.attention_count}
                  </Badge>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="space-y-6 lg:space-y-4">
          <div className="liquid-glass rounded-2xl pb-3 pt-1">
            <div className="mb-2 flex items-center gap-2.5 border-b border-white/[0.04] px-4 pb-3 pt-3">
              <div className="h-4 w-0.5 rounded-full bg-teal" />
              <ArrowDownCircle className="size-3.5 text-teal" />
              <h3 className="text-sm font-semibold text-chalk">Arrivals</h3>
              <Badge
                variant="outline"
                className="ml-auto border-white/[0.1] bg-transparent text-plum"
              >
                {pulse.arrivals.length}
              </Badge>
            </div>
            <div className="space-y-2 px-2 pb-3">
              {pulse.arrivals.length === 0 ? (
                <p className="py-4 text-center text-sm text-plum">
                  No arrivals today
                </p>
              ) : (
                pulse.arrivals.map((a, i) => (
                  <ListRow
                    key={`${a.guest_name}-${i}`}
                    title={a.guest_name}
                    subtitle={`Room ${a.room}${a.eta ? ` · ETA ${a.eta}` : ""}`}
                    avatar={getInitials(a.guest_name)}
                    right={
                      <StatusBadge
                        domain="booking"
                        status={a.status as BookingStatus}
                      />
                    }
                  />
                ))
              )}
            </div>
          </div>

          <div className="liquid-glass rounded-2xl pb-3 pt-1">
            <div className="mb-2 flex items-center gap-2.5 border-b border-white/[0.04] px-4 pb-3 pt-3">
              <div className="h-4 w-0.5 rounded-full bg-teal" />
              <ArrowUpCircle className="size-3.5 text-teal" />
              <h3 className="text-sm font-semibold text-chalk">
                Departures
              </h3>
              <Badge
                variant="outline"
                className="ml-auto border-white/[0.1] bg-transparent text-plum"
              >
                {pulse.departures.length}
              </Badge>
            </div>
            <div className="space-y-2 px-2 pb-3">
              {pulse.departures.length === 0 ? (
                <p className="py-4 text-center text-sm text-plum">
                  No departures today
                </p>
              ) : (
                pulse.departures.map((d, i) => (
                  <ListRow
                    key={`${d.guest_name}-${i}`}
                    title={d.guest_name}
                    subtitle={`Room ${d.room}`}
                    avatar={getInitials(d.guest_name)}
                    right={
                      d.balance_due > 0 ? (
                        <span className="text-sm font-semibold text-destructive">
                          {formatCurrency(d.balance_due)} due
                        </span>
                      ) : (
                        <Badge variant="outline" className="border-teal/40 bg-teal/10 text-teal">
                          Settled
                        </Badge>
                      )
                    }
                  />
                ))
              )}
            </div>
          </div>

          <div className="liquid-glass flex items-center gap-3 rounded-2xl p-4">
            <div className="rounded-xl bg-teal/10 p-2.5 ring-1 ring-teal/20">
              <Users className="size-5 text-teal" />
            </div>
            <div>
              <p className="text-lg font-bold text-chalk">{pulse.in_house_count} guests</p>
              <p className="text-sm text-plum">
                Currently in-house
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-plum">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/app/manager/bookings/new">
            <Button
              variant="outline"
              className="h-auto w-full flex-col gap-2 rounded-xl border-white/[0.08] liquid-glass py-4 hover:border-teal/30 hover:bg-teal/5"
            >
              <Plus className="size-5 text-teal" />
              <span className="text-xs font-medium">New Booking</span>
            </Button>
          </Link>
          <Link href="/app/manager/calendar">
            <Button
              variant="outline"
              className="h-auto w-full flex-col gap-2 rounded-xl border-white/[0.08] liquid-glass py-4 hover:border-teal/30 hover:bg-teal/5"
            >
              <CalendarDays className="size-5 text-teal" />
              <span className="text-xs font-medium">Calendar</span>
            </Button>
          </Link>
          <Link href="/app/manager/requests">
            <Button
              variant="outline"
              className="h-auto w-full flex-col gap-2 rounded-xl border-white/[0.08] liquid-glass py-4 hover:border-amber/30 hover:bg-amber/5"
            >
              <MessageSquare className="size-5 text-amber-light" />
              <span className="text-xs font-medium">Requests</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
