"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  BedDouble,
  Bell,
  Search,
  Plus,
  Trash2,
  ArrowDownCircle,
  AlertTriangle,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/shared/status-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { ListRow } from "@/components/shared/list-row";
import { RoomStatusPill } from "@/components/shared/room-status-pill";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChips } from "@/components/shared/filter-chips";
import { CurrencyInput } from "@/components/shared/currency-input";
import { PhoneInput } from "@/components/shared/phone-input";
import { VoiceInput } from "@/components/shared/voice-input";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { cn } from "@/lib/utils";
import type { BookingStatus, RoomStatus, RequestStatus } from "@/types";

const SOYL_COLORS = [
  { name: "Primary", value: "#B85518", token: "soyl-primary" },
  { name: "Primary Light", value: "#D4783E", token: "soyl-primary-light" },
  { name: "Secondary", value: "#1F5C3F", token: "soyl-secondary" },
  { name: "Secondary Light", value: "#2A7A54", token: "soyl-secondary-light" },
  { name: "Accent", value: "#C9971F", token: "soyl-accent" },
  { name: "Accent Light", value: "#E0B84A", token: "soyl-accent-light" },
  { name: "Background", value: "#F5F4F0", token: "soyl-bg" },
  { name: "Surface", value: "#FFFFFF", token: "soyl-surface" },
  { name: "Border", value: "#D9D5CC", token: "soyl-border" },
  { name: "Text", value: "#1A1A1A", token: "soyl-text" },
  { name: "Muted", value: "#5C5C5C", token: "soyl-muted" },
  { name: "Danger", value: "#8B2C2C", token: "soyl-danger" },
  { name: "Danger Light", value: "#A83E3E", token: "soyl-danger-light" },
];

const TYPE_SCALE = [
  { name: "xs", class: "text-xs", size: "0.75rem / 12px" },
  { name: "sm", class: "text-sm", size: "0.875rem / 14px" },
  { name: "base", class: "text-base", size: "1rem / 16px" },
  { name: "lg", class: "text-lg", size: "1.125rem / 18px" },
  { name: "xl", class: "text-xl", size: "1.25rem / 20px" },
  { name: "2xl", class: "text-2xl", size: "1.5rem / 24px" },
  { name: "3xl", class: "text-3xl", size: "2rem / 32px" },
  { name: "4xl", class: "text-4xl", size: "3rem / 48px" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-bold text-soyl-text">{title}</h2>
      <Separator className="mb-6 bg-soyl-border" />
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [filterValue, setFilterValue] = useState("all");
  const [currencyVal, setCurrencyVal] = useState("2500");
  const [phoneVal, setPhoneVal] = useState("9876543210");
  const [switchOn, setSwitchOn] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-soyl-bg pb-12"
    >
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-1 text-3xl font-bold text-soyl-text">SOYL Design System</h1>
        <p className="mb-8 text-sm text-soyl-muted">
          Component gallery and design token reference
        </p>

        {/* Colors */}
        <Section title="Colors">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {SOYL_COLORS.map((c) => (
              <div key={c.token} className="overflow-hidden rounded-lg border border-soyl-border">
                <div className="h-16" style={{ backgroundColor: c.value }} />
                <div className="bg-soyl-surface p-2">
                  <p className="text-xs font-semibold text-soyl-text">{c.name}</p>
                  <p className="text-xs text-soyl-muted">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-3">
            {TYPE_SCALE.map((t) => (
              <div key={t.name} className="flex items-baseline gap-4">
                <span className="w-20 shrink-0 text-xs text-soyl-muted">{t.size}</span>
                <span className={cn(t.class, "font-semibold text-soyl-text")}>
                  text-{t.name}: The quick brown fox
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button className="min-h-touch bg-soyl-primary text-white hover:bg-soyl-primary-light">Primary</Button>
                <Button variant="outline" className="min-h-touch border-soyl-border text-soyl-text">Outline</Button>
                <Button variant="ghost" className="min-h-touch text-soyl-text">Ghost</Button>
                <Button variant="secondary" className="min-h-touch">Secondary</Button>
                <Button className="min-h-touch bg-soyl-danger text-white hover:bg-soyl-danger-light">Destructive</Button>
                <Button disabled className="min-h-touch">Disabled</Button>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" className="bg-soyl-primary text-white hover:bg-soyl-primary-light">Small</Button>
                <Button className="min-h-touch bg-soyl-primary text-white hover:bg-soyl-primary-light">Default</Button>
                <Button size="lg" className="bg-soyl-primary text-white hover:bg-soyl-primary-light">Large</Button>
                <Button size="icon" className="bg-soyl-primary text-white hover:bg-soyl-primary-light">
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Text Input</Label>
              <Input placeholder="Enter text..." className="min-h-touch" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Input</Label>
              <PhoneInput value={phoneVal} onChange={setPhoneVal} />
            </div>
            <div className="space-y-1.5">
              <Label>Currency Input</Label>
              <CurrencyInput value={currencyVal} onChange={setCurrencyVal} />
            </div>
            <div className="space-y-1.5">
              <Label>Voice Input</Label>
              <VoiceInput placeholder="Speak or type..." />
            </div>
            <div className="space-y-1.5">
              <Label>Date Input</Label>
              <Input type="date" className="min-h-touch" />
            </div>
            <div className="space-y-1.5">
              <Label>Textarea</Label>
              <Textarea placeholder="Long text..." rows={3} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
              <Label>Toggle switch ({switchOn ? "On" : "Off"})</Label>
            </div>
          </div>
        </Section>

        {/* Metric Cards */}
        <Section title="Metric Cards">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard icon={<Wallet className="size-5" />} value="₹12,600" label="Revenue" />
            <MetricCard
              icon={<ArrowDownCircle className="size-5" />}
              value="₹8,300"
              label="Cash In"
              variant="success"
              trend={{ direction: "up", delta: "+12%" }}
            />
            <MetricCard
              icon={<AlertTriangle className="size-5" />}
              value="3"
              label="Pending"
              variant="warning"
            />
            <MetricCard
              icon={<Trash2 className="size-5" />}
              value="₹0"
              label="Refunds"
              variant="danger"
            />
          </div>
        </Section>

        {/* Badges */}
        <Section title="Status Badges">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">Booking Status</p>
              <div className="flex flex-wrap gap-2">
                {(["confirmed", "checked_in", "checked_out", "cancelled", "no_show"] as BookingStatus[]).map((s) => (
                  <StatusBadge key={s} domain="booking" status={s} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">Room Status</p>
              <div className="flex flex-wrap gap-2">
                {(["available", "occupied", "blocked", "maintenance", "dirty", "cleaning", "inspected"] as RoomStatus[]).map((s) => (
                  <StatusBadge key={s} domain="room" status={s} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">Request Status</p>
              <div className="flex flex-wrap gap-2">
                {(["open", "in_progress", "resolved", "escalated"] as RequestStatus[]).map((s) => (
                  <StatusBadge key={s} domain="request" status={s} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">Room Status Pills</p>
              <div className="flex flex-wrap gap-2">
                {(["available", "occupied", "dirty", "cleaning", "inspected"] as RoomStatus[]).map((s) => (
                  <RoomStatusPill key={s} roomNumber={`10${(["available", "occupied", "dirty", "cleaning", "inspected"] as RoomStatus[]).indexOf(s) + 1}`} status={s} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Filter Chips */}
        <Section title="Filter Chips">
          <FilterChips
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "closed", label: "Closed" },
            ]}
            activeValue={filterValue}
            onChange={setFilterValue}
          />
        </Section>

        {/* List Rows */}
        <Section title="List Rows">
          <Card className="border-soyl-border">
            <CardContent className="p-0">
              <ListRow
                title="Rajesh Kumar"
                subtitle="Room 101 · Check-in today"
                avatar="RK"
                right={<StatusBadge domain="booking" status="checked_in" />}
                onClick={() => {}}
              />
              <Separator className="bg-soyl-border" />
              <ListRow
                title="Priya Sharma"
                subtitle="Room 102 · Checkout tomorrow"
                avatar="PS"
                right={<Badge variant="outline" className="border-soyl-border text-soyl-muted">₹2,500</Badge>}
                onClick={() => {}}
              />
              <Separator className="bg-soyl-border" />
              <ListRow
                title="Extra towels needed"
                subtitle="Room 101 · 2h ago"
                icon={<Bell className="size-4" />}
                right={<StatusBadge domain="request" status="open" />}
                onClick={() => {}}
              />
            </CardContent>
          </Card>
        </Section>

        {/* Empty States */}
        <Section title="Empty States">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-soyl-border">
              <EmptyState
                icon={<BedDouble className="size-10" />}
                title="No rooms found"
                description="Try changing your filters to see more rooms."
              />
            </Card>
            <Card className="border-soyl-border">
              <EmptyState
                icon={<CalendarPlus className="size-10" />}
                title="No bookings yet"
                description="Create your first booking to get started."
                actionLabel="New Booking"
                onAction={() => {}}
              />
            </Card>
          </div>
        </Section>

        {/* Loading Skeletons */}
        <Section title="Loading Skeletons">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">Card</p>
              <LoadingSkeleton variant="card" count={2} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">List</p>
              <LoadingSkeleton variant="list" count={3} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">Detail</p>
              <LoadingSkeleton variant="detail" />
            </div>
          </div>
        </Section>

        {/* Dialogs & Sheets */}
        <Section title="Dialogs & Sheets">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(true)}
              className="min-h-touch border-soyl-border text-soyl-text"
            >
              Open Dialog
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(true)}
              className="min-h-touch border-soyl-border text-soyl-text"
            >
              Confirmation Dialog
            </Button>
            <Button
              variant="outline"
              onClick={() => setSheetOpen(true)}
              className="min-h-touch border-soyl-border text-soyl-text"
            >
              Open Sheet
            </Button>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sample Dialog</DialogTitle>
                <DialogDescription>
                  This is a standard dialog with header, content, and actions.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-soyl-text">Dialog body content goes here.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="min-h-touch">
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)} className="min-h-touch bg-soyl-primary text-white hover:bg-soyl-primary-light">
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ConfirmationDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete Room?"
            description="This action cannot be undone. The room and all its data will be permanently removed."
            confirmLabel="Delete"
            onConfirm={() => {}}
            variant="destructive"
          />

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sample Sheet</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input placeholder="Enter name..." className="min-h-touch" />
                </div>
                <div className="space-y-1.5">
                  <Label>Amount</Label>
                  <CurrencyInput value="1500" onChange={() => {}} />
                </div>
                <Button className="min-h-touch w-full bg-soyl-primary text-white hover:bg-soyl-primary-light">
                  Submit
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </Section>
      </div>
    </motion.div>
  );
}
