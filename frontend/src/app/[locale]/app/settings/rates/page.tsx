"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
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
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency } from "@/lib/formatters";

const ROOM_TYPES = ["Standard", "Deluxe", "Suite"];

interface BaseRate {
  type: string;
  rate: number;
}

interface RateOverride {
  id: string;
  room_type: string;
  start_date: string;
  end_date: string;
  rate: number;
}

const initialBaseRates: BaseRate[] = [
  { type: "Standard", rate: 1800 },
  { type: "Deluxe", rate: 2500 },
  { type: "Suite", rate: 4500 },
];

const initialOverrides: RateOverride[] = [
  {
    id: "ov1",
    room_type: "Deluxe",
    start_date: "2025-12-24",
    end_date: "2025-12-31",
    rate: 3500,
  },
];

export default function ManageRatesPage() {
  const router = useRouter();
  const [baseRates, setBaseRates] = useState(initialBaseRates);
  const [overrides, setOverrides] = useState(initialOverrides);
  const [newOverride, setNewOverride] = useState<Partial<RateOverride>>({
    room_type: "Standard",
  });

  function updateBaseRate(type: string, rate: number) {
    setBaseRates((prev) =>
      prev.map((r) => (r.type === type ? { ...r, rate } : r))
    );
  }

  function addOverride() {
    if (!newOverride.start_date || !newOverride.end_date || !newOverride.rate) {
      toast.error("Please fill all override fields");
      return;
    }
    const ov: RateOverride = {
      id: `ov${Date.now()}`,
      room_type: newOverride.room_type || "Standard",
      start_date: newOverride.start_date,
      end_date: newOverride.end_date,
      rate: newOverride.rate,
    };
    setOverrides((prev) => [...prev, ov]);
    setNewOverride({ room_type: "Standard" });
    toast.success("Rate override added");
  }

  function removeOverride(id: string) {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
    toast.success("Override removed");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-soyl-bg pb-6"
    >
      <div className="mx-auto max-w-2xl px-4">
        <PageHeader
          title="Rates & Overrides"
          showBack
          onBack={() => router.back()}
        />

        <Card className="mb-6 border-soyl-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-soyl-text">
              Base Rates by Room Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {baseRates.map((br) => (
              <div key={br.type} className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-soyl-text">{br.type}</span>
                <div className="relative w-32">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-soyl-muted">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={br.rate}
                    onChange={(e) => updateBaseRate(br.type, parseInt(e.target.value) || 0)}
                    className="min-h-touch pl-7 text-right"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-soyl-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-soyl-text">
              Date-Based Overrides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overrides.map((ov) => (
              <div
                key={ov.id}
                className="flex items-center justify-between rounded-lg bg-soyl-bg p-3"
              >
                <div>
                  <p className="text-sm font-medium text-soyl-text">
                    {ov.room_type} — {formatCurrency(ov.rate)}
                  </p>
                  <p className="text-xs text-soyl-muted">
                    {ov.start_date} to {ov.end_date}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOverride(ov.id)}
                  className="size-9 text-soyl-danger hover:bg-soyl-danger/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}

            <div className="space-y-3 rounded-lg border border-dashed border-soyl-border p-3">
              <p className="text-xs font-medium uppercase tracking-wider text-soyl-muted">
                Add Override
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="mb-1 text-xs">Room Type</Label>
                  <Select
                    value={newOverride.room_type}
                    onValueChange={(v) => setNewOverride({ ...newOverride, room_type: v })}
                  >
                    <SelectTrigger className="min-h-touch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 text-xs">Start Date</Label>
                  <Input
                    type="date"
                    value={newOverride.start_date ?? ""}
                    onChange={(e) => setNewOverride({ ...newOverride, start_date: e.target.value })}
                    className="min-h-touch"
                  />
                </div>
                <div>
                  <Label className="mb-1 text-xs">End Date</Label>
                  <Input
                    type="date"
                    value={newOverride.end_date ?? ""}
                    onChange={(e) => setNewOverride({ ...newOverride, end_date: e.target.value })}
                    className="min-h-touch"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="mb-1 text-xs">Rate (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Override rate"
                    value={newOverride.rate ?? ""}
                    onChange={(e) => setNewOverride({ ...newOverride, rate: parseInt(e.target.value) || 0 })}
                    className="min-h-touch"
                  />
                </div>
              </div>
              <Button
                onClick={addOverride}
                className="min-h-touch w-full gap-2 bg-soyl-primary text-white hover:bg-soyl-primary-light"
              >
                <Plus className="size-4" /> Add Override
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
