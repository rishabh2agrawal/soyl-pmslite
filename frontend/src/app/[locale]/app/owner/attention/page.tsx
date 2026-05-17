"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Clock,
  UserCheck,
  CreditCard,
  DoorClosed,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ATTENTION_ITEMS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatters";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isEmpty: boolean;
}

function AttentionSection({ title, icon, children, isEmpty }: SectionProps) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-soyl-text">{title}</h2>
      </div>
      {isEmpty ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-soyl-border bg-soyl-bg/50 px-4 py-3">
          <CheckCircle2 className="size-4 text-soyl-secondary" />
          <span className="text-sm text-soyl-muted">All clear</span>
        </div>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </section>
  );
}

export default function AttentionPage() {
  const router = useRouter();
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const handleAck = (id: string) => {
    setAcknowledged((prev) => new Set(prev).add(id));
  };

  const data = ATTENTION_ITEMS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 px-4"
    >
      <PageHeader
        title="What needs attention"
        showBack
        onBack={() => router.back()}
      />

      {/* Open requests over 4h */}
      <AttentionSection
        title="Open requests over 4 hours"
        icon={<Clock className="size-4 text-red-600" />}
        isEmpty={data.open_requests_over_4h.length === 0}
      >
        {data.open_requests_over_4h.map((item) => (
          <Card
            key={item.id}
            className={`border-red-200 bg-red-50 shadow-sm transition-opacity ${acknowledged.has(item.id) ? "opacity-40" : ""}`}
          >
            <CardContent className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="size-4 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-soyl-text">
                  {item.request}
                </p>
                <p className="text-xs text-soyl-muted">
                  Room {item.room} · {item.guest} · Routed to {item.routed_to}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  {item.elapsed}
                </span>
                {!acknowledged.has(item.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAck(item.id)}
                    className="text-xs text-red-700"
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </AttentionSection>

      {/* Unconfirmed arrivals */}
      <AttentionSection
        title="Unconfirmed arrivals"
        icon={<UserCheck className="size-4 text-amber-600" />}
        isEmpty={data.unconfirmed_arrivals.length === 0}
      >
        {data.unconfirmed_arrivals.map((item) => (
          <Card
            key={item.id}
            className={`border-amber-200 bg-amber-50 shadow-sm transition-opacity ${acknowledged.has(item.id) ? "opacity-40" : ""}`}
          >
            <CardContent className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <UserCheck className="size-4 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-soyl-text">
                  {item.guest}
                </p>
                <p className="text-xs text-soyl-muted">
                  Room {item.room} · ETA {item.eta}
                </p>
              </div>
              {!acknowledged.has(item.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAck(item.id)}
                  className="shrink-0 text-xs text-amber-700"
                >
                  Acknowledge
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </AttentionSection>

      {/* Payments due */}
      <AttentionSection
        title="Payments due"
        icon={<CreditCard className="size-4 text-amber-600" />}
        isEmpty={data.payments_due.length === 0}
      >
        {data.payments_due.map((item) => (
          <Card
            key={item.id}
            className={`border-amber-200 bg-amber-50 shadow-sm transition-opacity ${acknowledged.has(item.id) ? "opacity-40" : ""}`}
          >
            <CardContent className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <CreditCard className="size-4 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-soyl-text">
                  {item.guest}
                </p>
                <p className="text-xs text-soyl-muted">Room {item.room}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-semibold text-soyl-danger">
                  {formatCurrency(item.balance)}
                </span>
                {!acknowledged.has(item.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAck(item.id)}
                    className="text-xs text-amber-700"
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </AttentionSection>

      {/* Rooms blocked too long */}
      <AttentionSection
        title="Rooms blocked too long"
        icon={<DoorClosed className="size-4 text-orange-600" />}
        isEmpty={data.rooms_blocked_long.length === 0}
      >
        {data.rooms_blocked_long.map((item) => (
          <Card
            key={item.room}
            className={`border-orange-200 bg-orange-50 shadow-sm transition-opacity ${acknowledged.has(item.room) ? "opacity-40" : ""}`}
          >
            <CardContent className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <DoorClosed className="size-4 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-soyl-text">
                  Room {item.room}
                </p>
                <p className="text-xs text-soyl-muted">
                  Blocked for {item.blocked_for}
                </p>
              </div>
              {!acknowledged.has(item.room) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAck(item.room)}
                  className="shrink-0 text-xs text-orange-700"
                >
                  Acknowledge
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </AttentionSection>

      {/* Yesterday's misses */}
      <AttentionSection
        title="Yesterday's misses"
        icon={<AlertCircle className="size-4 text-soyl-muted" />}
        isEmpty={data.yday_misses.length === 0}
      >
        {data.yday_misses.map((item, i) => (
          <Card key={i} className="border-soyl-border shadow-sm">
            <CardContent className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-soyl-text">
                  {item.description}
                </p>
                <p className="text-xs text-soyl-muted">
                  {item.type} · Resolved late at {item.resolved_late_at}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </AttentionSection>

      <div className="pb-4" />
    </motion.div>
  );
}
