"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
  Legend,
} from "recharts";
import { Timer, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { FilterChips } from "@/components/shared/filter-chips";
import { WEEK_DATA } from "@/lib/mock-data";
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatters";

const COLORS = {
  primary: "#B85518",
  secondary: "#1F5C3F",
  accent: "#C9971F",
  muted: "#5C5C5C",
  border: "#D9D5CC",
};

const RANGE_OPTIONS = [
  { value: "this", label: "This Week" },
  { value: "last", label: "Last Week" },
];

export default function WeekPage() {
  const router = useRouter();
  const [range, setRange] = useState("this");
  const data = WEEK_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 px-4"
    >
      <PageHeader
        title="This Week"
        showBack
        onBack={() => router.back()}
      />

      <FilterChips
        options={RANGE_OPTIONS}
        activeValue={range}
        onChange={setRange}
      />

      {/* Occupancy Trend */}
      <Card className="border-soyl-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-soyl-text">
            Occupancy Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
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
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card className="border-soyl-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-soyl-text">
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Requests vs Resolved */}
      <Card className="border-soyl-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-soyl-text">
            Requests vs Resolved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.requests_vs_resolved}>
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
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    fontSize: 13,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Bar
                  dataKey="open"
                  name="Open"
                  fill={COLORS.accent}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="resolved"
                  name="Resolved"
                  fill={COLORS.secondary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Avg Response Time */}
      <MetricCard
        icon={<Timer className="size-5" />}
        value={`${data.avg_response_time.value} min`}
        label="Avg Response Time"
        trend={{
          direction: data.avg_response_time.delta < 0 ? "down" : "up",
          delta: `${data.avg_response_time.delta} min vs last week`,
        }}
        variant={data.avg_response_time.delta <= 0 ? "success" : "warning"}
      />

      {/* Per-room Performance */}
      <Card className="border-soyl-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-soyl-text">
            Per-room Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-soyl-border text-left text-soyl-muted">
                  <th className="pb-2 font-medium">Room</th>
                  <th className="pb-2 text-right font-medium">Nights Sold</th>
                  <th className="pb-2 text-right font-medium">Revenue</th>
                  <th className="pb-2 text-right font-medium">Avg Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.per_room.map((r) => (
                  <tr
                    key={r.room}
                    className="border-b border-soyl-border/50 last:border-0"
                  >
                    <td className="py-2.5 font-medium text-soyl-text">
                      {r.room}
                    </td>
                    <td className="py-2.5 text-right text-soyl-muted">
                      {r.nights}
                    </td>
                    <td className="py-2.5 text-right font-medium text-soyl-text">
                      {formatCurrency(r.revenue)}
                    </td>
                    <td className="py-2.5 text-right text-soyl-muted">
                      {formatCurrency(r.avg_rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 sm:hidden">
            {data.per_room.map((r) => (
              <div
                key={r.room}
                className="rounded-lg border border-soyl-border/50 bg-soyl-bg/30 p-3"
              >
                <div className="mb-1.5 text-sm font-semibold text-soyl-text">
                  Room {r.room}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-soyl-muted">Nights</span>
                    <p className="font-medium text-soyl-text">{r.nights}</p>
                  </div>
                  <div>
                    <span className="text-soyl-muted">Revenue</span>
                    <p className="font-medium text-soyl-text">
                      {formatCurrency(r.revenue)}
                    </p>
                  </div>
                  <div>
                    <span className="text-soyl-muted">Avg Rate</span>
                    <p className="font-medium text-soyl-text">
                      {formatCurrency(r.avg_rate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="pb-4" />
    </motion.div>
  );
}
