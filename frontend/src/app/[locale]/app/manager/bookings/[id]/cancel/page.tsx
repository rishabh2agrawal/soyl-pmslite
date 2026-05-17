"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { CurrencyInput } from "@/components/shared/currency-input";
import { BOOKINGS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatters";
import type { PaymentMethod } from "@/types";

const CANCEL_REASONS = [
  "Guest requested cancellation",
  "No show",
  "Duplicate booking",
  "Payment issue",
  "Force majeure",
  "Other",
];

const REFUND_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

const cancelSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  refund_amount: z.string().optional(),
  refund_method: z.string().optional(),
  comment: z.string().optional(),
});

type CancelForm = z.infer<typeof cancelSchema>;

export default function CancelBookingPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const [loading, setLoading] = useState(false);

  const booking = useMemo(
    () => BOOKINGS.find((b) => b.id === bookingId),
    [bookingId],
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelForm>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: "",
      refund_amount: booking?.advance_amount?.toString() || "0",
      refund_method: booking?.advance_method || "cash",
      comment: "",
    },
  });

  if (!booking) {
    return (
      <div className="flex items-center justify-center py-20 text-soyl-muted">
        Booking not found
      </div>
    );
  }

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Booking cancelled", {
        description: `Booking #${booking.id.toUpperCase()} has been cancelled`,
      });
      router.push(`/app/manager/bookings/${booking.id}`);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 pb-24"
    >
      <PageHeader
        title="Cancel Booking"
        subtitle={`${booking.guest_name} - Room ${booking.room_number}`}
        showBack
        onBack={() => router.back()}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Reason */}
        <Card className="border-soyl-border">
          <CardContent className="space-y-4">
            <div>
              <Label>Cancellation Reason</Label>
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-h-touch mt-1">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {CANCEL_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.reason && (
                <p className="mt-1 text-xs text-soyl-danger">{errors.reason.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Refund */}
        {(booking.advance_amount ?? 0) > 0 && (
          <Card className="border-soyl-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-soyl-muted">
                Refund Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-soyl-muted">Advance Paid</span>
                <span className="font-medium text-soyl-text">
                  {formatCurrency(booking.advance_amount || 0)}
                </span>
              </div>
              <div>
                <Label>Refund Amount</Label>
                <Controller
                  control={control}
                  name="refund_amount"
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  )}
                />
              </div>
              <div>
                <Label>Refund Method</Label>
                <Controller
                  control={control}
                  name="refund_method"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="min-h-touch mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REFUND_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comment */}
        <Card className="border-soyl-border">
          <CardContent>
            <Label htmlFor="comment">Additional Comments</Label>
            <Textarea
              id="comment"
              placeholder="Any additional notes..."
              className="mt-1 min-h-[100px]"
              {...register("comment")}
            />
          </CardContent>
        </Card>

        <StickyCTA
          primaryLabel="Confirm Cancellation"
          onPrimary={handleSubmit(onSubmit)}
          loading={loading}
          className="[&>button:last-child]:bg-soyl-danger [&>button:last-child]:hover:bg-soyl-danger-light"
        />
      </form>
    </motion.div>
  );
}
