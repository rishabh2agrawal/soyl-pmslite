"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Mount charts after layout so ResponsiveContainer reads non-zero dimensions (avoids Recharts -1 sizing warnings). */
export function ChartMount({
  children,
  className = "h-48",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className={cn("w-full min-w-0", className)}>
      {ready ? children : null}
    </div>
  );
}
