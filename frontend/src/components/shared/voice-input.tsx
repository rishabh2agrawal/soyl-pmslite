"use client";

import { useState, type ComponentProps } from "react";
import { Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface VoiceInputProps extends Omit<ComponentProps<"input">, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  onVoiceResult?: (transcript: string) => void;
  className?: string;
}

export function VoiceInput({
  value,
  onChange,
  onVoiceResult,
  className,
  ...inputProps
}: VoiceInputProps) {
  const [recording, setRecording] = useState(false);

  const toggleRecording = () => {
    setRecording((wasRecording) => {
      const next = !wasRecording;
      if (wasRecording && onVoiceResult) {
        onVoiceResult("(voice note)");
      }
      return next;
    });
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="min-h-touch pr-12 focus-visible:ring-teal/25"
        {...inputProps}
      />
      <button
        type="button"
        onClick={toggleRecording}
        aria-label={recording ? "Stop recording" : "Start recording"}
        className={cn(
          "absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md transition-colors",
          recording
            ? "animate-pulse text-red-400"
            : "text-plum hover:text-teal",
        )}
      >
        <Mic className="size-5" />
      </button>
    </div>
  );
}
