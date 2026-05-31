"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  MessageCircle,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/shared/page-header";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { CurrencyInput } from "@/components/shared/currency-input";
import { BOOKINGS, ROOMS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";
import type { PaymentMethod } from "@/types";

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

interface ExtraCharge {
  id: string;
  description: string;
  amount: number;
}

export default function CheckOutPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newChargeDesc, setNewChargeDesc] = useState("");
  const [newChargeAmount, setNewChargeAmount] = useState("");

  const booking = useMemo(
    () => BOOKINGS.find((b) => b.id === bookingId),
    [bookingId],
  );

  const room = useMemo(
    () => (booking ? ROOMS.find((r) => r.id === booking.room_id) : null),
    [booking],
  );

  const { control, handleSubmit } = useForm({
    defaultValues: {
      payment_amount: "",
      payment_method: "cash" as string,
    },
  });

  if (!booking || !room) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Booking not found
      </div>
    );
  }

  const nights = differenceInDays(
    parseISO(booking.check_out),
    parseISO(booking.check_in),
  );
  const roomTotal = booking.rate * nights;
  const extrasTotal = extraCharges.reduce((sum, c) => sum + c.amount, 0);
  const subtotal = roomTotal + extrasTotal;

  const gstRate = booking.invoice_type === "gst" ? 0.12 : 0;
  const gstAmount = Math.round(subtotal * gstRate);
  const grandTotal = subtotal + gstAmount;
  const advance = booking.advance_amount || 0;
  const balanceDue = grandTotal - advance;

  const addCharge = () => {
    if (!newChargeDesc || !newChargeAmount) return;
    setExtraCharges((prev) => [
      ...prev,
      {
        id: `ec-${Date.now()}`,
        description: newChargeDesc,
        amount: parseInt(newChargeAmount, 10) || 0,
      },
    ]);
    setNewChargeDesc("");
    setNewChargeAmount("");
    setSheetOpen(false);
  };

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Checked out successfully!", {
        description: `${booking.guest_name} - Room ${booking.room_number}`,
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
        title="Check Out"
        subtitle={`${booking.guest_name} - Room ${booking.room_number}`}
        showBack
        onBack={() => router.back()}
      />

      {/* Stay summary */}
      <Card className="border-white/[0.06] bg-white/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Stay Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="font-semibold text-foreground text-sm">
                {formatDate(booking.check_in, "dd MMM")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Check-out</p>
              <p className="font-semibold text-foreground text-sm">
                {formatDate(booking.check_out, "dd MMM")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nights</p>
              <p className="font-semibold text-foreground text-sm">{nights}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charges */}
      <Card className="border-white/[0.06] bg-white/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
            Charges
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <Button size="sm" variant="outline" className="h-8 border-white/[0.06] text-foreground" onClick={() => setSheetOpen(true)}>
                <Plus className="mr-1 size-3.5" />
                Add Charge
              </Button>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>Add Charge</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newChargeDesc}
                      onChange={(e) => setNewChargeDesc(e.target.value)}
                      placeholder="e.g. Room Service, Laundry"
                      className="min-h-touch mt-1"
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <CurrencyInput
                      value={newChargeAmount}
                      onChange={setNewChargeAmount}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={addCharge}
                    className="min-h-touch w-full bg-primary text-white hover:bg-primary-light"
                  >
                    Add Charge
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between py-1.5 text-sm">
            <span className="text-foreground">
              Room {booking.room_number} × {nights} night(s)
            </span>
            <span className="font-medium text-foreground">
              {formatCurrency(roomTotal)}
            </span>
          </div>
          {extraCharges.map((c) => (
            <div key={c.id} className="flex justify-between py-1.5 text-sm">
              <span className="text-foreground">{c.description}</span>
              <span className="font-medium text-foreground">
                {formatCurrency(c.amount)}
              </span>
            </div>
          ))}
          <Separator className="bg-border" />
          <div className="flex justify-between py-1 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              {formatCurrency(subtotal)}
            </span>
          </div>
          {booking.invoice_type === "gst" && (
            <div className="flex justify-between py-1 text-sm">
              <span className="text-muted-foreground">GST (12%)</span>
              <span className="font-medium text-foreground">
                {formatCurrency(gstAmount)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1 text-sm">
            <span className="text-muted-foreground">Advance Paid</span>
            <span className="font-medium text-emerald-light">
              -{formatCurrency(advance)}
            </span>
          </div>
          <Separator className="bg-border" />
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Balance Due</span>
            <span
              className={cn(
                "text-lg font-bold",
                balanceDue > 0 ? "text-destructive" : "text-emerald-light",
              )}
            >
              {formatCurrency(Math.max(0, balanceDue))}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment capture */}
      {balanceDue > 0 && (
        <Card className="border-white/[0.06] bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collect Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Amount</Label>
              <Controller
                control={control}
                name="payment_amount"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={balanceDue.toString()}
                    className="mt-1"
                  />
                )}
              />
            </div>
            <div>
              <Label>Method</Label>
              <Controller
                control={control}
                name="payment_method"
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
      )}

      {/* Generate / Share */}
      <Card className="border-white/[0.06] bg-white/80">
        <CardContent className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="min-h-touch w-full border-border text-foreground"
          >
            <Receipt className="mr-2 size-4" />
            Generate {booking.invoice_type === "gst" ? "Invoice" : "Receipt"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-touch w-full border-border text-foreground"
          >
            <MessageCircle className="mr-2 size-4 text-green-600" />
            Share via WhatsApp
          </Button>
        </CardContent>
      </Card>

      <StickyCTA
        primaryLabel="Mark as Checked Out"
        onPrimary={handleSubmit(onSubmit)}
        loading={loading}
      />
    </motion.div>
  );
}
