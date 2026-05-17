"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, CreditCard, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/shared/page-header";
import { CurrencyInput } from "@/components/shared/currency-input";
import { BOOKINGS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { FolioCharge, FolioPayment, PaymentMethod } from "@/types";

function generateFolioData(bookingId: string) {
  const booking = BOOKINGS.find((b) => b.id === bookingId) ?? BOOKINGS[0];
  const charges: FolioCharge[] = [
    { id: "fc1", description: "Room Charge", amount: booking.rate, date: booking.check_in, category: "room" },
    { id: "fc2", description: "Room Service - Dinner", amount: 650, date: booking.check_in, category: "food" },
    { id: "fc3", description: "Laundry", amount: 200, date: booking.check_in, category: "service" },
  ];
  const payments: FolioPayment[] = [
    { id: "fp1", amount: booking.advance_amount ?? 0, method: (booking.advance_method as PaymentMethod) ?? "cash", date: booking.check_in, reference: "Advance" },
  ];
  return { booking, charges, payments };
}

export default function FolioPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const initial = generateFolioData(bookingId);
  const [charges, setCharges] = useState<FolioCharge[]>(initial.charges);
  const [payments, setPayments] = useState<FolioPayment[]>(initial.payments);
  const booking = initial.booking;

  const [newCharge, setNewCharge] = useState({ description: "", amount: "", category: "room" });
  const [newPayment, setNewPayment] = useState({ amount: "", method: "cash" as PaymentMethod });
  const [chargeSheetOpen, setChargeSheetOpen] = useState(false);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);

  const totalCharges = charges.reduce((s, c) => s + c.amount, 0);
  const totalPayments = payments.reduce((s, p) => s + p.amount, 0);
  const balance = totalCharges - totalPayments;

  function addCharge() {
    if (!newCharge.description || !newCharge.amount) {
      toast.error("Fill all charge fields");
      return;
    }
    setCharges((prev) => [
      ...prev,
      {
        id: `fc${Date.now()}`,
        description: newCharge.description,
        amount: parseInt(newCharge.amount),
        date: new Date().toISOString().split("T")[0],
        category: newCharge.category,
      },
    ]);
    setNewCharge({ description: "", amount: "", category: "room" });
    setChargeSheetOpen(false);
    toast.success("Charge added");
  }

  function addPayment() {
    if (!newPayment.amount) {
      toast.error("Enter payment amount");
      return;
    }
    setPayments((prev) => [
      ...prev,
      {
        id: `fp${Date.now()}`,
        amount: parseInt(newPayment.amount),
        method: newPayment.method,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewPayment({ amount: "", method: "cash" });
    setPaymentSheetOpen(false);
    toast.success("Payment recorded");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-soyl-bg pb-6"
    >
      <div className="mx-auto max-w-2xl px-4">
        <PageHeader
          title={`Folio — Room ${booking.room_number}`}
          showBack
          onBack={() => router.back()}
        />

        <div className="mb-4 rounded-lg bg-soyl-surface p-3">
          <p className="text-sm font-medium text-soyl-text">{booking.guest_name}</p>
          <p className="text-xs text-soyl-muted">
            {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
          </p>
        </div>

        {/* Balance Summary */}
        <Card
          className={cn(
            "mb-6 border-2",
            balance > 0
              ? "border-soyl-danger/30 bg-soyl-danger/5"
              : "border-soyl-secondary/30 bg-soyl-secondary/5"
          )}
        >
          <CardContent className="py-5 text-center">
            <p className="text-sm text-soyl-muted">Balance Due</p>
            <p
              className={cn(
                "text-3xl font-bold",
                balance > 0 ? "text-soyl-danger" : "text-soyl-secondary"
              )}
            >
              {formatCurrency(Math.abs(balance))}
            </p>
            {balance <= 0 && (
              <p className="mt-1 text-xs text-soyl-secondary">
                {balance === 0 ? "Fully Settled" : "Credit Balance"}
              </p>
            )}
            <div className="mt-3 flex justify-center gap-6 text-xs text-soyl-muted">
              <span>Charges: {formatCurrency(totalCharges)}</span>
              <span>Paid: {formatCurrency(totalPayments)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Charges */}
        <Card className="mb-4 border-soyl-border">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-soyl-text">Charges</CardTitle>
            <Sheet open={chargeSheetOpen} onOpenChange={setChargeSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1 border-soyl-border text-soyl-text">
                  <Plus className="size-3.5" /> Add
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add Charge</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Input
                      value={newCharge.description}
                      onChange={(e) => setNewCharge({ ...newCharge, description: e.target.value })}
                      placeholder="e.g. Room Service"
                      className="min-h-touch"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Amount</Label>
                    <CurrencyInput
                      value={newCharge.amount}
                      onChange={(v) => setNewCharge({ ...newCharge, amount: v })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      value={newCharge.category}
                      onValueChange={(v) => setNewCharge({ ...newCharge, category: v })}
                    >
                      <SelectTrigger className="min-h-touch"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room">Room</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="tax">Tax</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={addCharge}
                    className="min-h-touch w-full bg-soyl-primary text-white hover:bg-soyl-primary-light"
                  >
                    Add Charge
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            {charges.map((c) => (
              <div key={c.id} className="flex items-center justify-between border-b border-soyl-border px-4 py-3 last:border-b-0">
                <div>
                  <p className="text-sm text-soyl-text">{c.description}</p>
                  <p className="text-xs text-soyl-muted">{formatDate(c.date)}</p>
                </div>
                <span className="text-sm font-medium text-soyl-text">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payments */}
        <Card className="border-soyl-border">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-soyl-text">Payments</CardTitle>
            <Sheet open={paymentSheetOpen} onOpenChange={setPaymentSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1 border-soyl-border text-soyl-text">
                  <Plus className="size-3.5" /> Add
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add Payment</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label>Amount</Label>
                    <CurrencyInput
                      value={newPayment.amount}
                      onChange={(v) => setNewPayment({ ...newPayment, amount: v })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Method</Label>
                    <Select
                      value={newPayment.method}
                      onValueChange={(v) => setNewPayment({ ...newPayment, method: v as PaymentMethod })}
                    >
                      <SelectTrigger className="min-h-touch"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={addPayment}
                    className="min-h-touch w-full bg-soyl-primary text-white hover:bg-soyl-primary-light"
                  >
                    Record Payment
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-soyl-border px-4 py-3 last:border-b-0">
                <div className="flex items-center gap-2">
                  {p.method === "cash" ? (
                    <IndianRupee className="size-4 text-soyl-muted" />
                  ) : (
                    <CreditCard className="size-4 text-soyl-muted" />
                  )}
                  <div>
                    <p className="text-sm capitalize text-soyl-text">{p.method.replace("_", " ")}</p>
                    <p className="text-xs text-soyl-muted">{formatDate(p.date)}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-soyl-secondary">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
