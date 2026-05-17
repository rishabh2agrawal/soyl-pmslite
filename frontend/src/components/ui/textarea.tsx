import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-chalk shadow-none ring-offset-transparent transition-colors placeholder:text-plum/60 focus-visible:border-teal/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal/25 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
