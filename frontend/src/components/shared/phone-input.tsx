"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function formatPhone(digits: string): string {
  const clean = digits.replace(/\D/g, "").slice(0, 10);
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "XXXXX XXXXX",
  className,
}: PhoneInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
      onChange(digits);
    },
    [onChange],
  );

  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-soyl-muted">
        +91
      </span>
      <Input
        type="tel"
        inputMode="numeric"
        value={formatPhone(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className="min-h-touch pl-12"
      />
    </div>
  );
}
