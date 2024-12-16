import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-xl",
        "border border-border/40 bg-background/50",
        "px-3 py-2 text-sm text-foreground",
        "transition-colors duration-200",
        "placeholder:text-muted-foreground/50",
        // File input styles
        "file:border-0 file:bg-transparent",
        "file:text-sm file:font-medium",
        "file:text-muted-foreground/70",
        "file:hover:text-muted-foreground",
        // States
        "hover:border-border/80",
        "focus-visible:outline-none",
        "focus-visible:border-primary/20",
        "focus-visible:bg-accent/5",
        "focus-visible:ring-2",
        "focus-visible:ring-ring/30",
        "focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
