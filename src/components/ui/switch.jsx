import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9",
      "shrink-0 cursor-pointer items-center",
      "rounded-full",
      "bg-accent/10",
      "transition-colors duration-200",
      // Focus state
      "focus:outline-none",
      // Hover state
      "hover:bg-accent/20",
      // Checked state
      "data-[state=checked]:bg-primary/20",
      // Disabled state
      "disabled:cursor-not-allowed",
      "disabled:opacity-30",
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block",
        "h-4 w-4",
        "rounded-full",
        "bg-foreground/50",
        "transition-all duration-200",
        // Position transitions
        "data-[state=checked]:translate-x-[18px]",
        "data-[state=unchecked]:translate-x-0.5",
        // Background transitions
        "data-[state=checked]:bg-primary",
        "data-[state=unchecked]:bg-foreground/40",
        // Scale and opacity effects
        "data-[state=checked]:scale-100",
        "data-[state=unchecked]:scale-90",
        "data-[state=checked]:opacity-100",
        "data-[state=unchecked]:opacity-80"
      )} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
