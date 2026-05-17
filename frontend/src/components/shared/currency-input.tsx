"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function formatIndianNumber(numStr: string): string {
  const cleaned = numStr.replace(/[^0-9]/g, "");
  if (!cleaned) return "";

  const num = parseInt(cleaned, 10);
  return num.toLocaleString("en-IN");
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  disabled = false,
  className,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() => formatIndianNumber(value));

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setDisplayValue(raw);
      onChange(raw);
    },
    [onChange],
  );

  const handleBlur = useCallback(() => {
    setDisplayValue(formatIndianNumber(value));
  }, [value]);

  const handleFocus = useCallback(() => {
    setDisplayValue(value.replace(/[^0-9]/g, ""));
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-soyl-muted">
        ₹
      </span>
      <Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-touch pl-7"
      />
    </div>
  );
}
