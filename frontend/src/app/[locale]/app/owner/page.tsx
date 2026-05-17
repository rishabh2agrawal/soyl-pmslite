"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ListRow } from "@/components/shared/list-row";
import { PULSE_DATA } from "@/lib/mock-data";
import { formatCurrency, formatPercent, getGreeting, getInitials, formatDate } from "@/lib/formatters";
import { useAppStore } from "@/lib/store";

const today = new Date().toISOString().split("T")[0];

export default function OwnerPulsePage() {
  const propertyName = useAppStore((s) => s.propertyName);
  const pulse = PULSE_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 px-4 pb-6"
    >
      {/* Greeting */}
      <div className="pt-2">
        <h2 className="text-2xl font-bold text-soyl-text">
          {getGreeting()}{propertyName ? `, ${propertyName}` : ""}
        </h2>
        <p className="text-sm text-soyl-muted">
          {formatDate(today, "EEEE, dd MMMM yyyy")}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<BedDouble className="size-5" />}
          value={`${pulse.occupancy.occupied}/${pulse.occupancy.total}`}
          label={`${formatPercent(pulse.occupancy.percent)} occupied`}
          variant="success"
        />
        <MetricCard
          icon={<IndianRupee className="size-5" />}
          value={formatCurrency(pulse.today.earnings)}
          label="Today's earnings"
        />
        <MetricCard
          icon={<ArrowDownCircle className="size-5" />}
          value={String(pulse.today.check_ins)}
          label="Check-ins"
        />
        <MetricCard
          icon={<ArrowUpCircle className="size-5" />}
          value={String(pulse.today.check_outs)}
          label="Check-outs"
        />
      </div>

      {/* Attention banner */}
      {pulse.attention_count > 0 && (
        <Link href="/en/app/owner/attention">
          <Card className="border-soyl-accent/40 bg-soyl-accent/5 cursor-pointer transition-colors hover:bg-soyl-accent/10">
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-full bg-soyl-accent/20 p-2">
                <AlertTriangle className="size-5 text-soyl-accent" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-soyl-text">
                  {pulse.attention_count} items need attention
                </p>
                {pulse.attention_overdue > 0 && (
                  <p className="text-sm text-soyl-danger font-medium">
                    {pulse.attention_overdue} overdue
                  </p>
                )}
              </div>
              <Badge className="bg-soyl-accent text-white">{pulse.attention_count}</Badge>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Arrivals */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ArrowDownCircle className="size-4 text-soyl-primary" />
            Arrivals
            <Badge variant="outline" className="ml-auto">{pulse.arrivals.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {pulse.arrivals.length === 0 ? (
            <p className="py-4 text-center text-sm text-soyl-muted">No arrivals today</p>
          ) : (
            pulse.arrivals.map((a, i) => (
              <ListRow
                key={i}
                title={a.guest_name}
                subtitle={`Room ${a.room}${a.eta ? ` · ETA ${a.eta}` : ""}`}
                avatar={getInitials(a.guest_name)}
                right={<StatusBadge domain="booking" status={a.status as import("@/types").BookingStatus} />}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Departures */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ArrowUpCircle className="size-4 text-soyl-muted" />
            Departures
            <Badge variant="outline" className="ml-auto">{pulse.departures.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {pulse.departures.length === 0 ? (
            <p className="py-4 text-center text-sm text-soyl-muted">No departures today</p>
          ) : (
            pulse.departures.map((d, i) => (
              <ListRow
                key={i}
                title={d.guest_name}
                subtitle={`Room ${d.room}`}
                avatar={getInitials(d.guest_name)}
                right={
                  d.balance_due > 0 ? (
                    <span className="text-sm font-semibold text-soyl-danger">
                      {formatCurrency(d.balance_due)} due
                    </span>
                  ) : (
                    <Badge variant="secondary" className="bg-soyl-secondary/10 text-soyl-secondary">
                      Settled
                    </Badge>
                  )
                }
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* In-house */}
      <Card className="border-soyl-border">
        <CardContent className="flex items-center gap-3 py-3">
          <div className="rounded-lg bg-soyl-secondary/10 p-2.5">
            <Users className="size-5 text-soyl-secondary" />
          </div>
          <div>
            <p className="text-lg font-bold text-soyl-text">{pulse.in_house_count} guests</p>
            <p className="text-sm text-soyl-muted">Currently in-house</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="space-y-2 pt-2">
        <h3 className="text-sm font-semibold text-soyl-muted uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/en/app/manager/bookings/new">
            <Button
              variant="outline"
              className="h-auto w-full flex-col gap-2 rounded-xl border-soyl-border py-4 hover:border-soyl-primary hover:bg-soyl-primary/5"
            >
              <Plus className="size-5 text-soyl-primary" />
              <span className="text-xs font-medium">New Booking</span>
            </Button>
          </Link>
          <Link href="/en/app/manager/calendar">
            <Button
              variant="outline"
              className="h-auto w-full flex-col gap-2 rounded-xl border-soyl-border py-4 hover:border-soyl-secondary hover:bg-soyl-secondary/5"
            >
              <CalendarDays className="size-5 text-soyl-secondary" />
              <span className="text-xs font-medium">Calendar</span>
            </Button>
          </Link>
          <Link href="/en/app/manager/requests">
            <Button
              variant="outline"
              className="h-auto w-full flex-col gap-2 rounded-xl border-soyl-border py-4 hover:border-soyl-accent hover:bg-soyl-accent/5"
            >
              <MessageSquare className="size-5 text-soyl-accent" />
              <span className="text-xs font-medium">Requests</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
