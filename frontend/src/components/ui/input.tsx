import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "min-h-touch w-full rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-chalk shadow-none ring-offset-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-plum/60 focus-visible:border-teal/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal/25 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
