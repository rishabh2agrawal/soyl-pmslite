"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { ListRow } from "@/components/shared/list-row";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { BOOKINGS } from "@/lib/mock-data";
import { formatDate, formatCurrency, getInitials } from "@/lib/formatters";
import { pageTransitionProps, stagger, staggerItem } from "@/lib/motion";
import type { BookingStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
];

function bookingStatusBorder(status: BookingStatus): string {
  const map: Record<BookingStatus, string> = {
    confirmed: "border-l-[var(--s-confirmed-fg)]",
    checked_in: "border-l-teal",
    checked_out: "border-l-plum/50",
    cancelled: "border-l-destructive/60",
    no_show: "border-l-[#C9A84C]/60",
  };
  return map[status];
}

export default function BookingsListPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredBookings = useMemo(() => {
    let result = [...BOOKINGS];
    if (filter !== "all") {
      result = result.filter((b) => b.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.guest_name.toLowerCase().includes(q) ||
          b.room_number.includes(q) ||
          b.id.toLowerCase().includes(q),
      );
    }
    return result;
  }, [filter, search]);

  return (
    <motion.div {...pageTransitionProps} className="space-y-5 pb-8">
      <PageHeader
        title="Bookings"
        action={
          <Link href="/app/manager/bookings/new">
            <Button
              size="sm"
              className="bg-teal text-ink shadow-glow hover:bg-chalk"
            >
              <Plus className="mr-1.5 size-4" />
              New
            </Button>
          </Link>
        }
      />

      <div
        className={cn(
          "liquid-glass rounded-xl px-3 py-2 transition-all",
          "focus-within:border-teal/40 focus-within:shadow-glow-sm",
        )}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-plum" />
          <Input
            placeholder="Search by guest name, room, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "min-h-touch border-0 bg-transparent pl-10 shadow-none placeholder:text-plum/50",
              "text-chalk focus-visible:ring-1 focus-visible:ring-teal/25 focus-visible:ring-offset-0",
            )}
          />
        </div>
      </div>

      <FilterChips
        options={STATUS_FILTERS}
        activeValue={filter}
        onChange={setFilter}
      />

      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={<Search className="size-10 text-plum" />}
          title="No bookings found"
          description="Try adjusting your filters or search term"
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {filteredBookings.map((booking) => (
            <motion.div key={booking.id} variants={staggerItem}>
              <Link href={`/app/manager/bookings/${booking.id}`}>
                <Card
                  className={cn(
                    "liquid-glass rounded-xl border-0 shadow-none transition-colors glass-hover hover:border-teal/10",
                    "border-l-2",
                    bookingStatusBorder(booking.status),
                  )}
                >
                  <CardContent className="py-3">
                    <ListRow
                      title={booking.guest_name}
                      subtitle={`Room ${booking.room_number} · ${formatDate(booking.check_in, "dd MMM")} → ${formatDate(booking.check_out, "dd MMM")} · ${formatCurrency(booking.rate)}/night`}
                      avatar={getInitials(booking.guest_name)}
                      right={
                        <StatusBadge domain="booking" status={booking.status} />
                      }
                    />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
