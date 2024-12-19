import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border bg-secondary/20 px-4 py-2 text-sm",
        "border-border/20 hover:border-border/30",
        "ring-offset-2 ring-offset-background",
        "transition-all duration-200",
        "placeholder:text-muted-foreground/50",
        "focus-visible:outline-none focus-visible:bg-secondary/30",
        "focus-visible:ring-2 focus-visible:ring-primary/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive/50 focus-visible:ring-destructive/30",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
