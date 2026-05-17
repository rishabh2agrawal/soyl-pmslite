"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Calculator } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { CurrencyInput } from "@/components/shared/currency-input";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { DAY_CLOSE_DATA } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export default function DayClosePage() {
  const data = DAY_CLOSE_DATA;
  const [actualClosing, setActualClosing] = useState(String(data.actual_closing));

  const actual = parseInt(actualClosing || "0", 10);
  const variance = actual - data.expected_closing;

  function handleSubmit() {
    toast.success("Day close submitted successfully");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-soyl-bg pb-24"
    >
      <div className="mx-auto max-w-2xl px-4">
        <PageHeader title="Day Close" subtitle={formatDate(data.date)} />

        <div className="mb-6 grid grid-cols-2 gap-3">
          <MetricCard
            icon={<Wallet className="size-5" />}
            value={formatCurrency(data.opening_cash)}
            label="Opening Cash"
          />
          <MetricCard
            icon={<ArrowDownCircle className="size-5" />}
            value={formatCurrency(data.cash_collected)}
            label="Cash Collected"
            variant="success"
          />
          <MetricCard
            icon={<ArrowUpCircle className="size-5" />}
            value={formatCurrency(data.cash_refunds)}
            label="Cash Refunds"
            variant={data.cash_refunds > 0 ? "danger" : "default"}
          />
          <MetricCard
            icon={<Calculator className="size-5" />}
            value={formatCurrency(data.expected_closing)}
            label="Expected Closing"
          />
        </div>

        <Card className="mb-6 border-soyl-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-soyl-text">
              Cash Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            {data.breakdown.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-soyl-border px-4 py-3 last:border-b-0"
              >
                <span className="text-sm text-soyl-text">{item.label}</span>
                <span className="text-sm font-medium text-soyl-text">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between bg-soyl-bg px-4 py-3 font-semibold">
              <span className="text-sm text-soyl-text">Subtotal</span>
              <span className="text-sm text-soyl-text">
                {formatCurrency(data.breakdown.reduce((s, i) => s + i.amount, 0))}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 space-y-2">
          <label className="text-sm font-medium text-soyl-text">
            Actual Closing Cash
          </label>
          <CurrencyInput
            value={actualClosing}
            onChange={setActualClosing}
            placeholder="Enter amount"
          />
        </div>

        <div className="mb-6">
          {variance === 0 ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              No Variance
            </Badge>
          ) : (
            <div className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-3",
              "border-soyl-danger/30 bg-soyl-danger/5"
            )}>
              <span className="text-sm font-medium text-soyl-danger">
                Variance: {formatCurrency(Math.abs(variance))}
                {variance > 0 ? " (over)" : " (short)"}
              </span>
            </div>
          )}
        </div>

        <StickyCTA primaryLabel="Submit Day Close" onPrimary={handleSubmit} />
      </div>
    </motion.div>
  );
}
