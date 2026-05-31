"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { MessageCircle, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { PhoneInput } from "@/components/shared/phone-input";
import { CurrencyInput } from "@/components/shared/currency-input";
import { BOOKINGS, GUESTS, ROOMS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatters";
import type { PaymentMethod, IdProofType } from "@/types";

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

const ID_TYPES: { value: IdProofType; label: string }[] = [
  { value: "aadhaar", label: "Aadhaar" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "voter_id", label: "Voter ID" },
  { value: "pan", label: "PAN" },
];

export default function CheckInPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const [loading, setLoading] = useState(false);

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

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      guest_name: booking?.guest_name || "",
      phone: booking?.guest_phone?.replace(/\D/g, "").slice(-10) || "",
      id_type: guest?.id_type || "",
      id_number: guest?.id_number_masked || "",
      advance_amount: "",
      advance_method: "cash" as string,
    },
  });

  if (!booking || !room) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Booking not found
      </div>
    );
  }

  const advance = booking.advance_amount || 0;

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Checked in successfully!", {
        description: `${booking.guest_name} → Room ${booking.room_number}`,
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
        title="Check In"
        subtitle={`${booking.guest_name} → Room ${booking.room_number}`}
        showBack
        onBack={() => router.back()}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Verify guest details */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verify Guest Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="guest_name">Guest Name</Label>
              <Input
                id="guest_name"
                className="min-h-touch mt-1"
                {...register("guest_name")}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-1"
                  />
                )}
              />
            </div>
            <div>
              <Label>ID Proof Type</Label>
              <Controller
                control={control}
                name="id_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-h-touch mt-1">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ID_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="id_number">ID Number</Label>
              <Input
                id="id_number"
                className="min-h-touch mt-1"
                {...register("id_number")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Room assignment */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Room Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-xl bg-navy-500/80 p-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 shadow-soft">
                <span className="text-lg font-bold text-primary">
                  {room.number}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{room.type}</p>
                <p className="text-sm text-muted-foreground">
                  Floor {room.floor} · {formatCurrency(booking.rate)}/night
                </p>
              </div>
              <CheckCircle className="ml-auto size-5 text-emerald-light" />
            </div>
          </CardContent>
        </Card>

        {/* Payment capture */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Advance Paid</span>
              <span className="font-medium text-emerald-light">
                {formatCurrency(advance)}
              </span>
            </div>
            <Separator className="bg-border" />
            <div>
              <Label>Additional Payment</Label>
              <Controller
                control={control}
                name="advance_amount"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="0"
                    className="mt-1"
                  />
                )}
              />
            </div>
            <div>
              <Label>Method</Label>
              <Controller
                control={control}
                name="advance_method"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-h-touch mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
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

        {/* Extra actions */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardContent className="space-y-3">
            {booking.is_foreign && (
              <Button
                type="button"
                variant="outline"
                className="min-h-touch w-full border-border text-foreground"
              >
                <FileText className="mr-2 size-4" />
                Generate C-Form
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="min-h-touch w-full border-border text-foreground"
            >
              <MessageCircle className="mr-2 size-4 text-green-600" />
              Send WhatsApp Welcome
            </Button>
          </CardContent>
        </Card>

        <StickyCTA
          primaryLabel="Mark as Checked In"
          onPrimary={handleSubmit(onSubmit)}
          loading={loading}
        />
      </form>
    </motion.div>
  );
}
