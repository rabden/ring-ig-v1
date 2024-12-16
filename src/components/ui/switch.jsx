import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9",
      "shrink-0 cursor-pointer items-center",
      "rounded-full border border-border/40",
      "bg-background/50",
      "transition-all duration-200",
      // Focus state
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-ring/30",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-background",
      // Hover state
      "hover:bg-accent/5",
      "hover:border-border/80",
      // Checked state
      "data-[state=checked]:bg-primary/90",
      "data-[state=checked]:border-primary/90",
      // Unchecked state
      "data-[state=unchecked]:bg-background/50",
      // Disabled state
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block",
        "h-3.5 w-3.5",
        "rounded-full",
        "bg-background",
        "shadow-sm shadow-primary/10",
        "ring-0",
        "transition-all duration-200",
        // Position transitions
        "data-[state=checked]:translate-x-4",
        "data-[state=unchecked]:translate-x-1",
        // Background transitions
        "data-[state=checked]:bg-primary-foreground",
        "data-[state=unchecked]:bg-foreground/50",
        // Scale effect
        "data-[state=checked]:scale-100",
        "data-[state=unchecked]:scale-90"
      )} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
