"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BedDouble,
  LogIn,
  LogOut,
  Users,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ListRow } from "@/components/shared/list-row";
import { BOOKINGS, ROOMS, REQUESTS } from "@/lib/mock-data";
import { formatDate, getInitials } from "@/lib/formatters";
import type { Booking } from "@/types";

const today = new Date().toISOString().split("T")[0];

export default function ManagerTodayPage() {
  const availableRooms = useMemo(
    () => ROOMS.filter((r) => r.status === "available"),
    [],
  );

  const arrivals = useMemo(
    () =>
      BOOKINGS.filter(
        (b) =>
          b.check_in === today &&
          (b.status === "confirmed" || b.status === "checked_in"),
      ),
    [],
  );

  const departures = useMemo(
    () =>
      BOOKINGS.filter(
        (b) =>
          b.check_out === today &&
          (b.status === "checked_in" || b.status === "checked_out"),
      ),
    [],
  );

  const inHouse = useMemo(
    () => BOOKINGS.filter((b) => b.status === "checked_in"),
    [],
  );

  const openRequests = useMemo(
    () =>
      REQUESTS.filter(
        (r) => r.status === "open" || r.status === "in_progress" || r.status === "escalated",
      ),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 px-4 pb-8"
    >
      <PageHeader
        title="Today"
        subtitle={formatDate(today, "EEEE, dd MMM yyyy")}
      />

      {/* Room availability */}
      <Card className="border-soyl-border">
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-soyl-secondary/10 p-2.5 shadow-soft">
              <BedDouble className="size-5 text-soyl-secondary" />
            </div>
            <div>
              <p className="text-lg font-bold text-soyl-text">
                {availableRooms.length} rooms available
              </p>
              <p className="text-sm text-soyl-muted">
                of {ROOMS.length} total
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-soyl-secondary/15 text-soyl-secondary text-base px-3 py-1"
          >
            {availableRooms.length}
          </Badge>
        </CardContent>
      </Card>

      {/* Arrivals */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-soyl-text">
            <LogIn className="size-4 text-soyl-primary" />
            Arrivals
            <Badge variant="outline" className="ml-auto border-soyl-border text-soyl-muted">
              {arrivals.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-2">
          {arrivals.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-soyl-muted">
              No arrivals today
            </p>
          ) : (
            arrivals.map((booking) => (
              <ArrivalRow key={booking.id} booking={booking} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Departures */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-soyl-text">
            <LogOut className="size-4 text-soyl-muted" />
            Departures
            <Badge variant="outline" className="ml-auto border-soyl-border text-soyl-muted">
              {departures.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-2">
          {departures.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-soyl-muted">
              No departures today
            </p>
          ) : (
            departures.map((booking) => (
              <Link
                key={booking.id}
                href={`/app/manager/bookings/${booking.id}`}
              >
                <ListRow
                  title={booking.guest_name}
                  subtitle={`Room ${booking.room_number}`}
                  avatar={getInitials(booking.guest_name)}
                  right={
                    <StatusBadge domain="booking" status={booking.status} />
                  }
                />
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {/* In-house */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-soyl-text">
            <Users className="size-4 text-soyl-secondary" />
            In-House Guests
            <Badge variant="outline" className="ml-auto border-soyl-border text-soyl-muted">
              {inHouse.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-2">
          {inHouse.map((booking) => (
            <Link
              key={booking.id}
              href={`/app/manager/bookings/${booking.id}`}
            >
              <ListRow
                title={booking.guest_name}
                subtitle={`Room ${booking.room_number}`}
                avatar={getInitials(booking.guest_name)}
                right={
                  <StatusBadge domain="booking" status={booking.status} />
                }
              />
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Open requests */}
      <Link href="/app/manager/requests">
        <Card className="border-soyl-border transition-colors hover:bg-soyl-accent/5">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-soyl-accent/10 p-2.5 shadow-soft">
                <AlertCircle className="size-5 text-soyl-accent" />
              </div>
              <div>
                <p className="font-semibold text-soyl-text">Open Requests</p>
                <p className="text-sm text-soyl-muted">
                  {openRequests.length} pending
                </p>
              </div>
            </div>
            <Badge className="bg-soyl-accent text-white text-base px-3 py-1">
              {openRequests.length}
            </Badge>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function ArrivalRow({ booking }: { booking: Booking }) {
  return (
    <div className="flex min-h-touch items-center gap-3 rounded-[0.625rem] border border-transparent px-3 py-2.5 transition-colors hover:border-soyl-border/60 hover:bg-white/70">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-soyl-primary/10 text-sm font-semibold text-soyl-primary">
        {getInitials(booking.guest_name)}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/app/manager/bookings/${booking.id}`}
          className="truncate text-sm font-medium text-soyl-text hover:underline"
        >
          {booking.guest_name}
        </Link>
        <span className="text-xs text-soyl-muted">
          Room {booking.room_number}
        </span>
      </div>
      <StatusBadge domain="booking" status={booking.status} />
      {booking.status === "confirmed" && (
        <Link href={`/app/manager/bookings/${booking.id}/check-in`}>
          <Button
            size="sm"
            className="min-h-[40px] bg-soyl-secondary text-white hover:bg-soyl-secondary-light"
          >
            Check In
          </Button>
        </Link>
      )}
    </div>
  );
}
