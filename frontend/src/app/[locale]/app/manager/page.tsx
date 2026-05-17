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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ListRow } from "@/components/shared/list-row";
import { BOOKINGS, ROOMS, REQUESTS } from "@/lib/mock-data";
import { formatDate, getInitials } from "@/lib/formatters";
import type { Booking, RoomStatus } from "@/types";
import { pageTransitionProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

const today = new Date().toISOString().split("T")[0];

function roomSegmentClasses(status: RoomStatus): string {
  return cn(
    "h-full flex-1 rounded-full",
    status === "occupied" && "bg-plum",
    status === "available" && "bg-teal",
    status === "dirty" && "bg-[#C9A84C]",
    status === "maintenance" && "bg-destructive/60",
    status === "blocked" && "bg-white/20",
    status === "cleaning" && "bg-[#80B8E0]",
    status === "inspected" && "bg-teal/50",
  );
}

function SectionHeading({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
}) {
  return (
    <div className="mb-2 flex items-center gap-2.5 px-1">
      <div className="h-4 w-0.5 rounded-full bg-teal" />
      <Icon className="size-3.5 text-teal" />
      <h3 className="text-sm font-semibold text-chalk">{title}</h3>
      <span className="ml-auto text-xs font-medium text-plum">{count}</span>
    </div>
  );
}

export default function ManagerTodayPage() {
  const availableRooms = useMemo(
    () => ROOMS.filter((r) => r.status === "available"),
    [],
  );

  const roomStats = useMemo(() => {
    const occupied = ROOMS.filter((r) => r.status === "occupied").length;
    const dirty = ROOMS.filter((r) => r.status === "dirty").length;
    const available = ROOMS.filter((r) => r.status === "available").length;
    return { occupied, dirty, available };
  }, []);

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
        (r) =>
          r.status === "open" ||
          r.status === "in_progress" ||
          r.status === "escalated",
      ),
    [],
  );

  return (
    <motion.div {...pageTransitionProps} className="pb-8">
      <PageHeader
        title="Today"
        subtitle={formatDate(today, "EEEE, dd MMM yyyy")}
      />

      <div className="mt-5 space-y-4 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-5 lg:space-y-0">
        <div className="space-y-4">
          <div className="liquid-glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold leading-none text-chalk">
                  {availableRooms.length}
                </p>
                <p className="mt-1 text-xs text-plum">
                  rooms available of {ROOMS.length}
                </p>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <BedDouble className="size-5" />
              </div>
            </div>
            <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-white/[0.06]">
              {ROOMS.map((room) => (
                <div
                  key={room.id}
                  className={cn("min-w-px flex-1", roomSegmentClasses(room.status))}
                  title={`Room ${room.number}: ${room.status}`}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-plum">
              <span>Occupied {roomStats.occupied}</span>
              <span>Dirty {roomStats.dirty}</span>
              <span>Available {roomStats.available}</span>
            </div>
          </div>

          <Link href="/app/manager/requests">
            <div className="liquid-glass glass-hover rounded-2xl p-4 transition-colors hover:border-teal/20">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber/10 p-2.5 ring-1 ring-amber/20">
                    <AlertCircle className="size-5 text-amber-light" />
                  </div>
                  <div>
                    <p className="font-semibold text-chalk">Open Requests</p>
                    <p className="text-sm text-plum">{openRequests.length} pending</p>
                  </div>
                </div>
                <Badge className="border border-amber/30 bg-amber/15 px-3 py-1 text-sm text-amber-light">
                  {openRequests.length}
                </Badge>
              </div>
            </div>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="liquid-glass rounded-2xl pb-3 pt-1">
            <div className="px-4 pt-3">
              <SectionHeading icon={LogIn} title="Arrivals" count={arrivals.length} />
            </div>
            <div className="space-y-2 px-2">
              {arrivals.length === 0 ? (
                <p className="py-6 text-center text-sm text-plum">
                  No arrivals today
                </p>
              ) : (
                arrivals.map((booking) => (
                  <ArrivalRow key={booking.id} booking={booking} />
                ))
              )}
            </div>
          </div>

          <div className="liquid-glass rounded-2xl pb-3 pt-1">
            <div className="px-4 pt-3">
              <SectionHeading
                icon={LogOut}
                title="Departures"
                count={departures.length}
              />
            </div>
            <div className="space-y-2 px-2">
              {departures.length === 0 ? (
                <p className="py-6 text-center text-sm text-plum">
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
            </div>
          </div>

          <div className="liquid-glass rounded-2xl pb-3 pt-1">
            <div className="px-4 pt-3">
              <SectionHeading icon={Users} title="In-House Guests" count={inHouse.length} />
            </div>
            <div className="space-y-2 px-2">
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
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ArrivalRow({ booking }: { booking: Booking }) {
  return (
    <div className="flex min-h-touch items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/10 text-sm font-semibold text-teal ring-1 ring-teal/25">
        {getInitials(booking.guest_name)}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/app/manager/bookings/${booking.id}`}
          className="truncate text-sm font-semibold text-chalk hover:text-teal hover:underline"
        >
          {booking.guest_name}
        </Link>
        <span className="text-xs text-plum">
          Room {booking.room_number}
        </span>
      </div>
      <StatusBadge domain="booking" status={booking.status} />
      {booking.status === "confirmed" && (
        <Link href={`/app/manager/bookings/${booking.id}/check-in`}>
          <Button
            size="sm"
            className="min-h-[40px] bg-teal text-ink hover:bg-chalk"
          >
            Check In
          </Button>
        </Link>
      )}
    </div>
  );
}
