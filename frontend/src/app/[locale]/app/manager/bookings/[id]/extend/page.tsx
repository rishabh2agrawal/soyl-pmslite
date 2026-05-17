"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { CalendarPlus, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { CurrencyInput } from "@/components/shared/currency-input";
import { BOOKINGS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { addDays, parseISO, differenceInDays } from "date-fns";

export default function ExtendStayPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const [loading, setLoading] = useState(false);

  const booking = useMemo(
    () => BOOKINGS.find((b) => b.id === bookingId),
    [bookingId],
  );

  const defaultNewCheckout = booking
    ? addDays(parseISO(booking.check_out), 1).toISOString().split("T")[0]
    : "";

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      new_check_out: defaultNewCheckout,
      override_rate: false,
      custom_rate: booking?.rate?.toString() || "",
    },
  });

  const newCheckOut = watch("new_check_out");
  const overrideRate = watch("override_rate");

  if (!booking) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Booking not found
      </div>
    );
  }

  const currentNights = differenceInDays(
    parseISO(booking.check_out),
    parseISO(booking.check_in),
  );

  const newNights = newCheckOut
    ? differenceInDays(parseISO(newCheckOut), parseISO(booking.check_in))
    : currentNights;

  const additionalNights = newNights - currentNights;

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Stay extended!", {
        description: `Extended by ${additionalNights} night(s) to ${formatDate(newCheckOut)}`,
      });
      router.push(`/app/manager/bookings/${booking.id}`);
    }, 500);
  };

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-6 px-4 pb-28"
    >
      <PageHeader
        title="Extend Stay"
        subtitle={`${booking.guest_name} - Room ${booking.room_number}`}
        showBack
        onBack={() => router.back()}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current checkout */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Check-out</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(booking.check_out)}
                </p>
              </div>
              <CalendarPlus className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* New checkout */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new_check_out">New Check-out Date</Label>
              <Input
                id="new_check_out"
                type="date"
                className="min-h-touch mt-1"
                min={booking.check_out}
                {...register("new_check_out")}
              />
            </div>

            {additionalNights > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-secondary/10 p-3 text-sm">
                <CheckCircle className="size-4 text-emerald-light" />
                <span className="text-foreground">
                  Room available for {additionalNights} additional night(s)
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rate override */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Override Rate</Label>
              <Switch
                checked={overrideRate}
                onCheckedChange={(v) => setValue("override_rate", v)}
              />
            </div>
            {overrideRate && (
              <div>
                <Label>Custom Rate (per night)</Label>
                <Controller
                  control={control}
                  name="custom_rate"
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  )}
                />
              </div>
            )}
            {!overrideRate && (
              <p className="text-sm text-muted-foreground">
                Current rate: {formatCurrency(booking.rate)}/night
              </p>
            )}
          </CardContent>
        </Card>

        <StickyCTA
          primaryLabel="Confirm Extension"
          onPrimary={handleSubmit(onSubmit)}
          loading={loading}
          disabled={additionalNights <= 0}
        />
      </form>
    </motion.div>
  );
}
