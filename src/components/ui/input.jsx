import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full",
        "rounded-lg",
        "bg-popover/95",
        "px-3 py-2",
        "text-sm",
        "text-foreground/90",
        "transition-colors duration-200",
        "placeholder:text-muted-foreground/40",
        // File input styles
        "file:border-0",
        "file:bg-transparent",
        "file:text-sm",
        "file:font-medium",
        "file:text-muted-foreground/60",
        "file:hover:text-muted-foreground/80",
        // States
        "hover:bg-accent/5",
        "focus:bg-accent/5",
        "focus:outline-none",
        "disabled:opacity-30",
        "disabled:pointer-events-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
