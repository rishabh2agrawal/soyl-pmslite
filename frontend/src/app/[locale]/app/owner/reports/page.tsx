"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { ChartMount } from "@/components/shared/chart-mount";
import { WEEK_DATA } from "@/lib/mock-data";
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatters";

const COLORS = {
  primary: "#AFD0CC",
  secondary: "#19A97B",
  accent: "#F5A623",
  muted: "#5C5C5C",
  border: "#D9D5CC",
};

const TAB_OPTIONS = [
  { value: "occupancy", label: "Occupancy" },
  { value: "revenue", label: "Revenue" },
  { value: "gst", label: "GST" },
];

const DATE_RANGE_OPTIONS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
];

const MOCK_GST = [
  { description: "Room Revenue", taxable: 95000, cgst: 5700, sgst: 5700, igst: 0 },
  { description: "Food & Beverage", taxable: 12000, cgst: 600, sgst: 600, igst: 0 },
  { description: "Other Services", taxable: 3500, cgst: 210, sgst: 210, igst: 0 },
];

export default function ReportsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("occupancy");
  const [dateRange, setDateRange] = useState("week");
  const data = WEEK_DATA;

  const gstTotal = MOCK_GST.reduce(
    (acc, row) => ({
      taxable: acc.taxable + row.taxable,
      cgst: acc.cgst + row.cgst,
      sgst: acc.sgst + row.sgst,
      igst: acc.igst + row.igst,
    }),
    { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
  );

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-5 px-4 pb-8"
    >
      <PageHeader
        title="Reports"
        showBack
        onBack={() => router.back()}
      />

      <FilterChips options={TAB_OPTIONS} activeValue={tab} onChange={setTab} />

      <FilterChips
        options={DATE_RANGE_OPTIONS}
        activeValue={dateRange}
        onChange={setDateRange}
        className="pb-0"
      />

      {/* Occupancy Tab */}
      {tab === "occupancy" && (
        <Card className="border-white/[0.06] bg-white/80 shadow-soft">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartMount className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.occupancy_by_day}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: COLORS.muted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: COLORS.muted }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Occupancy"]}
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border}`,
                      fontSize: 13,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percent"
                    stroke={COLORS.secondary}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: COLORS.secondary }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartMount>
          </CardContent>
        </Card>
      )}

      {/* Revenue Tab */}
      {tab === "revenue" && (
        <Card className="border-white/[0.06] bg-white/80 shadow-soft">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartMount className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenue_by_day}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: COLORS.muted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: COLORS.muted }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatCurrencyCompact(v)}
                  />
                  <Tooltip
                    formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border}`,
                      fontSize: 13,
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill={COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartMount>
          </CardContent>
        </Card>
      )}

      {/* GST Tab */}
      {tab === "gst" && (
        <Card className="border-white/[0.06] bg-white/80 shadow-soft">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">
              GST Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Description</th>
                    <th className="pb-2 text-right font-medium">Taxable</th>
                    <th className="pb-2 text-right font-medium">CGST</th>
                    <th className="pb-2 text-right font-medium">SGST</th>
                    <th className="pb-2 text-right font-medium">IGST</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_GST.map((row) => (
                    <tr
                      key={row.description}
                      className="border-b border-white/[0.08]"
                    >
                      <td className="py-2.5 pr-3 text-foreground">
                        {row.description}
                      </td>
                      <td className="py-2.5 text-right text-foreground">
                        {formatCurrency(row.taxable)}
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground">
                        {formatCurrency(row.cgst)}
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground">
                        {formatCurrency(row.sgst)}
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground">
                        {formatCurrency(row.igst)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="pt-3 pr-3 text-foreground">Total</td>
                    <td className="pt-3 text-right text-foreground">
                      {formatCurrency(gstTotal.taxable)}
                    </td>
                    <td className="pt-3 text-right text-primary">
                      {formatCurrency(gstTotal.cgst)}
                    </td>
                    <td className="pt-3 text-right text-primary">
                      {formatCurrency(gstTotal.sgst)}
                    </td>
                    <td className="pt-3 text-right text-muted-foreground">
                      {formatCurrency(gstTotal.igst)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <Button
        variant="outline"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-border text-sm font-medium text-foreground"
        onClick={() => {
          // PDF export placeholder
        }}
      >
        <Download className="size-4" />
        Export PDF
      </Button>

      <div className="pb-4" />
    </motion.div>
  );
}
