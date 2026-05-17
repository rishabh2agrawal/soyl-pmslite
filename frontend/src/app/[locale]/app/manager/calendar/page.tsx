"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { addDays, format, parseISO, isWithinInterval } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { ROOMS, BOOKINGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const DAY_OPTIONS = [
  { value: "7", label: "7 Days" },
  { value: "14", label: "14 Days" },
  { value: "30", label: "30 Days" },
];

const statusColors: Record<BookingStatus, string> = {
  confirmed: "bg-teal/70",
  checked_in: "bg-teal",
  checked_out: "bg-plum/60",
  cancelled: "bg-destructive/60",
  no_show: "bg-[#C9A84C]/70",
};

const CELL_WIDTH = 64;

export default function CalendarPage() {
  const [dayRange, setDayRange] = useState("7");
  const numDays = parseInt(dayRange, 10);
  const startDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dates = useMemo(
    () => Array.from({ length: numDays }, (_, i) => addDays(startDate, i)),
    [numDays, startDate],
  );

  const bookingMap = useMemo(() => {
    const map = new Map<string, typeof BOOKINGS>();
    ROOMS.forEach((r) => map.set(r.id, []));
    BOOKINGS.forEach((b) => {
      const existing = map.get(b.room_id) || [];
      existing.push(b);
      map.set(b.room_id, existing);
    });
    return map;
  }, []);

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-5 px-4 pb-8"
    >
      <PageHeader title="Calendar" subtitle="Room availability grid" />

      <FilterChips
        options={DAY_OPTIONS}
        activeValue={dayRange}
        onChange={setDayRange}
      />

      <div className="liquid-glass overflow-hidden rounded-2xl border-0 shadow-none">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `120px repeat(${numDays}, ${CELL_WIDTH}px)`,
          }}
        >
          {/* Header row */}
          <div className="sticky left-0 z-20 border-b border-r border-white/[0.04] bg-surface-1 px-3 py-2 backdrop-blur-sm">
            <span className="text-xs font-medium text-plum">Room</span>
          </div>
          {dates.map((d) => (
            <div
              key={d.toISOString()}
              className="border-b border-r border-white/[0.04] bg-white/[0.03] px-1 py-2 text-center backdrop-blur-sm"
            >
              <div className="text-[10px] font-medium text-plum">
                {format(d, "EEE")}
              </div>
              <div className="text-xs font-semibold text-chalk">
                {format(d, "dd")}
              </div>
            </div>
          ))}

          {/* Room rows */}
          {ROOMS.map((room) => {
            const roomBookings = bookingMap.get(room.id) || [];
            return (
              <RoomRow
                key={room.id}
                roomNumber={room.number}
                roomType={room.type}
                roomId={room.id}
                bookings={roomBookings}
                dates={dates}
                startDate={startDate}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-1">
        {(Object.entries(statusColors) as [BookingStatus, string][]).map(
          ([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={cn("size-3 rounded-sm", color)} />
              <span className="text-xs capitalize text-plum">
                {status.replace("_", " ")}
              </span>
            </div>
          ),
        )}
      </div>
    </motion.div>
  );
}

function RoomRow({
  roomNumber,
  roomType,
  roomId,
  bookings,
  dates,
  startDate,
}: {
  roomNumber: string;
  roomType: string;
  roomId: string;
  bookings: typeof BOOKINGS;
  dates: Date[];
  startDate: Date;
}) {
  return (
    <>
      {/* Sticky room label */}
      <div className="sticky left-0 z-10 flex flex-col justify-center border-b border-r border-white/[0.04] bg-surface-1 px-3 py-2 backdrop-blur-sm">
        <span className="text-sm font-semibold text-chalk">{roomNumber}</span>
        <span className="text-[10px] text-plum">{roomType}</span>
      </div>

      {/* Date cells */}
      {dates.map((date, colIndex) => {
        const booking = bookings.find((b) => {
          const ci = parseISO(b.check_in);
          const co = parseISO(b.check_out);
          ci.setHours(0, 0, 0, 0);
          co.setHours(0, 0, 0, 0);
          return isWithinInterval(date, { start: ci, end: addDays(co, -1) });
        });

        if (booking) {
          const ci = parseISO(booking.check_in);
          ci.setHours(0, 0, 0, 0);
          const isStart =
            date.getTime() === ci.getTime() ||
            (colIndex === 0 && ci < startDate);

          return (
            <Link
              key={date.toISOString()}
              href={`/app/manager/bookings/${booking.id}`}
              className={cn(
                "relative flex items-center border-b border-r border-white/[0.04]",
                isStart ? "justify-start" : "justify-center",
              )}
            >
              <div
                className={cn(
                  "absolute inset-y-1 inset-x-0 rounded-sm shadow-soft",
                  statusColors[booking.status],
                  "opacity-80 hover:opacity-100 transition-opacity",
                )}
              />
              {isStart && (
                <span className="relative z-10 truncate px-1 text-[10px] font-medium text-white">
                  {booking.guest_name.split(" ")[0]}
                </span>
              )}
            </Link>
          );
        }

        const dateStr = format(date, "yyyy-MM-dd");
        return (
          <Link
            key={date.toISOString()}
            href={`/app/manager/bookings/new?room=${roomId}&date=${dateStr}`}
            className="border-b border-r border-white/[0.04] bg-white/[0.02] transition-colors hover:bg-teal/[0.06]"
          />
        );
      })}
    </>
  );
}
