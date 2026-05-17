"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
import type { BookingStatus } from "@/types";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
];

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
          b.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [filter, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 px-4 pb-8"
    >
      <PageHeader
        title="Bookings"
        action={
          <Link href="/en/app/manager/bookings/new">
            <Button size="sm" className="bg-soyl-primary text-white hover:bg-soyl-primary-light">
              <Plus className="mr-1.5 size-4" />
              New
            </Button>
          </Link>
        }
      />

      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-soyl-muted" />
          <Input
            placeholder="Search by guest name, room, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <FilterChips options={STATUS_FILTERS} activeValue={filter} onChange={setFilter} />

      <div className="space-y-2">
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon={<Search className="size-10 text-soyl-muted" />}
            title="No bookings found"
            description="Try adjusting your filters or search term"
          />
        ) : (
          filteredBookings.map((booking) => (
            <Link key={booking.id} href={`/en/app/manager/bookings/${booking.id}`}>
              <Card className="border-soyl-border/70 bg-white/80 shadow-soft transition-colors hover:bg-soyl-bg/60">
                <CardContent className="py-3">
                  <ListRow
                    title={booking.guest_name}
                    subtitle={`Room ${booking.room_number} · ${formatDate(booking.check_in, "dd MMM")} → ${formatDate(booking.check_out, "dd MMM")} · ${formatCurrency(booking.rate)}/night`}
                    avatar={getInitials(booking.guest_name)}
                    right={<StatusBadge domain="booking" status={booking.status} />}
                  />
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </motion.div>
  );
}
