"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Mail,
  CreditCard,
  Tag,
  FileText,
  Plus,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { ListRow } from "@/components/shared/list-row";
import { StatusBadge } from "@/components/shared/status-badge";
import { GUESTS, BOOKINGS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getInitials } from "@/lib/formatters";

export default function GuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const guestId = params.id as string;

  const guest = useMemo(() => GUESTS.find((g) => g.id === guestId), [guestId]);
  const stays = useMemo(
    () => BOOKINGS.filter((b) => b.guest_id === guestId),
    [guestId]
  );

  if (!guest) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Guest not found</p>
      </div>
    );
  }

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-6 px-4 pb-8"
    >
      <PageHeader
        title={guest.name}
        showBack
        onBack={() => router.back()}
        action={
          <Link href="/en/app/manager/bookings/new">
            <Button size="sm" className="bg-primary text-white hover:bg-primary-light">
              <Plus className="mr-1.5 size-4" />
              Book
            </Button>
          </Link>
        }
      />

      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {getInitials(guest.name)}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{guest.name}</h2>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {guest.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-amber/10 text-amber-light text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <Card className="border-white/[0.06] bg-white/80">
        <CardContent className="space-y-3 py-3">
          <div className="flex items-center gap-3">
            <Phone className="size-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{guest.phone}</span>
          </div>
          {guest.email && (
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{guest.email}</span>
            </div>
          )}
          {guest.id_type && (
            <div className="flex items-center gap-3">
              <CreditCard className="size-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {guest.id_type.replace("_", " ")} · {guest.id_number_masked}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lifetime spend */}
      <MetricCard
        icon={<IndianRupee className="size-5" />}
        value={formatCurrency(guest.lifetime_spend ?? 0)}
        label="Lifetime spend"
      />

      {/* Notes */}
      {guest.notes && (
        <Card className="border-white/[0.06] bg-white/80">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="size-4 text-muted-foreground" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{guest.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Stay history */}
      <Card className="border-white/[0.06] bg-white/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Tag className="size-4 text-primary" />
            Stay History
            <Badge variant="outline" className="ml-auto">
              {stays.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {stays.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No stays recorded</p>
          ) : (
            stays.map((booking) => (
              <Link
                key={booking.id}
                href={`/en/app/manager/bookings/${booking.id}`}
              >
                <ListRow
                  title={`Room ${booking.room_number}`}
                  subtitle={`${formatDate(booking.check_in, "dd MMM")} → ${formatDate(booking.check_out, "dd MMM")} · ${formatCurrency(booking.rate)}/night`}
                  right={<StatusBadge domain="booking" status={booking.status} />}
                />
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
