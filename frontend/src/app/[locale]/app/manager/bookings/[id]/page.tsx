"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  LogOut,
  XCircle,
  CalendarPlus,
  ArrowRightLeft,
  Plus,
  FileText,
  RefreshCw,
  Phone,
  CreditCard,
  User,
  Calendar,
  BedDouble,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { TimelineEntry } from "@/components/shared/timeline-entry";
import { BOOKINGS, GUESTS, ROOMS, TIMELINE_EVENTS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";
import type { Booking } from "@/types";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const booking = useMemo(
    () => BOOKINGS.find((b) => b.id === bookingId),
    [bookingId],
  );

  const guest = useMemo(
    () => (booking ? GUESTS.find((g) => g.id === booking.guest_id) : null),
    [booking],
  );

  const room = useMemo(
    () => (booking ? ROOMS.find((r) => r.id === booking.room_id) : null),
    [booking],
  );

  const events = useMemo(
    () => TIMELINE_EVENTS.filter((e) => e.ref_id === bookingId).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    ),
    [bookingId],
  );

  if (!booking) {
    return (
      <div className="flex items-center justify-center py-20 text-soyl-muted">
        Booking not found
      </div>
    );
  }

  const nights = differenceInDays(
    parseISO(booking.check_out),
    parseISO(booking.check_in),
  );
  const total = booking.rate * nights;
  const advance = booking.advance_amount || 0;
  const balance = total - advance;

  const folio = {
    charges: [
      {
        id: "fc1",
        description: `Room ${booking.room_number} - ${nights} night(s)`,
        amount: total,
        date: booking.check_in,
        category: "room",
      },
    ],
    payments: advance
      ? [
          {
            id: "fp1",
            amount: advance,
            method: booking.advance_method || "cash",
            date: booking.created_at,
            reference: "",
          },
        ]
      : [],
    balance,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 pb-6"
    >
      <PageHeader
        title={`Booking #${booking.id.toUpperCase()}`}
        showBack
        onBack={() => router.back()}
        action={<StatusBadge domain="booking" status={booking.status} />}
      />

      {/* Guest info */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-soyl-muted">
            <User className="size-4" />
            Guest Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-semibold text-soyl-text">{booking.guest_name}</p>
          <div className="flex items-center gap-2 text-sm text-soyl-muted">
            <Phone className="size-3.5" />
            {booking.guest_phone}
          </div>
          {guest?.id_type && (
            <div className="text-sm text-soyl-muted">
              {guest.id_type.replace("_", " ").toUpperCase()}: {guest.id_number_masked}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stay info */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-soyl-muted">
            <Calendar className="size-4" />
            Stay Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <span className="text-soyl-muted">Check-in</span>
              <p className="font-medium text-soyl-text">{formatDate(booking.check_in)}</p>
            </div>
            <div>
              <span className="text-soyl-muted">Check-out</span>
              <p className="font-medium text-soyl-text">{formatDate(booking.check_out)}</p>
            </div>
            <div>
              <span className="text-soyl-muted">Room</span>
              <p className="font-medium text-soyl-text">
                {booking.room_number} ({room?.type})
              </p>
            </div>
            <div>
              <span className="text-soyl-muted">Nights</span>
              <p className="font-medium text-soyl-text">{nights}</p>
            </div>
            <div>
              <span className="text-soyl-muted">Rate</span>
              <p className="font-medium text-soyl-text">{formatCurrency(booking.rate)}/night</p>
            </div>
            <div>
              <span className="text-soyl-muted">Total</span>
              <p className="text-lg font-bold text-soyl-text">{formatCurrency(total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment summary */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-soyl-muted">
            <CreditCard className="size-4" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-soyl-muted">Advance Paid</span>
            <span className="font-medium text-soyl-secondary">{formatCurrency(advance)}</span>
          </div>
          <Separator className="bg-soyl-border" />
          <div className="flex justify-between text-sm">
            <span className="font-medium text-soyl-text">Balance Due</span>
            <span className={cn("text-lg font-bold", balance > 0 ? "text-soyl-danger" : "text-soyl-secondary")}>
              {formatCurrency(balance)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-soyl-border">
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <ActionButtons booking={booking} />
          </div>
        </CardContent>
      </Card>

      {/* Folio */}
      <Card className="border-soyl-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-soyl-muted">
            <Receipt className="size-4" />
            Folio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-soyl-muted">Charges</p>
            {folio.charges.map((c) => (
              <div key={c.id} className="flex justify-between py-1.5 text-sm">
                <span className="text-soyl-text">{c.description}</span>
                <span className="font-medium text-soyl-text">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </div>
          <Separator className="bg-soyl-border" />
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-soyl-muted">Payments</p>
            {folio.payments.length > 0 ? (
              folio.payments.map((p) => (
                <div key={p.id} className="flex justify-between py-1.5 text-sm">
                  <span className="text-soyl-text capitalize">{p.method.replace("_", " ")}</span>
                  <span className="font-medium text-soyl-secondary">
                    -{formatCurrency(p.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-1.5 text-sm text-soyl-muted">No payments recorded</p>
            )}
          </div>
          <Separator className="bg-soyl-border" />
          <div className="flex justify-between">
            <span className="font-semibold text-soyl-text">Balance</span>
            <span className={cn("text-lg font-bold", folio.balance > 0 ? "text-soyl-danger" : "text-soyl-secondary")}>
              {formatCurrency(folio.balance)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {events.length > 0 && (
        <Card className="border-soyl-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-soyl-muted">
              Booking Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.map((event, i) => (
              <TimelineEntry
                key={event.id}
                event={event}
                isLast={i === events.length - 1}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function ActionButtons({ booking }: { booking: Booking }) {
  const base = `/app/manager/bookings/${booking.id}`;

  switch (booking.status) {
    case "confirmed":
      return (
        <>
          <Link href={`${base}/check-in`} className="col-span-2">
            <Button className="min-h-touch w-full bg-soyl-secondary text-white hover:bg-soyl-secondary-light">
              <LogIn className="mr-2 size-4" />
              Check In
            </Button>
          </Link>
          <Link href={`${base}/cancel`}>
            <Button variant="outline" className="min-h-touch w-full border-soyl-danger text-soyl-danger hover:bg-soyl-danger/5">
              <XCircle className="mr-2 size-4" />
              Cancel
            </Button>
          </Link>
          <Link href={`${base}/extend`}>
            <Button variant="outline" className="min-h-touch w-full border-soyl-border text-soyl-text">
              <CalendarPlus className="mr-2 size-4" />
              Modify
            </Button>
          </Link>
        </>
      );
    case "checked_in":
      return (
        <>
          <Link href={`${base}/check-out`} className="col-span-2">
            <Button className="min-h-touch w-full bg-soyl-primary text-white hover:bg-soyl-primary-light">
              <LogOut className="mr-2 size-4" />
              Check Out
            </Button>
          </Link>
          <Link href={`${base}/extend`}>
            <Button variant="outline" className="min-h-touch w-full border-soyl-border text-soyl-text">
              <CalendarPlus className="mr-2 size-4" />
              Extend Stay
            </Button>
          </Link>
          <Link href={`${base}/room-change`}>
            <Button variant="outline" className="min-h-touch w-full border-soyl-border text-soyl-text">
              <ArrowRightLeft className="mr-2 size-4" />
              Change Room
            </Button>
          </Link>
        </>
      );
    case "checked_out":
      return (
        <Button variant="outline" className="col-span-2 min-h-touch border-soyl-border text-soyl-text">
          <FileText className="mr-2 size-4" />
          View Invoice
        </Button>
      );
    case "cancelled":
      return (
        <Link href="/app/manager/bookings/new" className="col-span-2">
          <Button className="min-h-touch w-full bg-soyl-primary text-white hover:bg-soyl-primary-light">
            <RefreshCw className="mr-2 size-4" />
            Rebook
          </Button>
        </Link>
      );
    default:
      return null;
  }
}
