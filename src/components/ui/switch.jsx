import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9",
      "shrink-0 cursor-pointer items-center",
      "rounded-full",
      "bg-accent/20",
      "transition-colors duration-200",
      "focus:outline-none",
      "hover:bg-accent/30",
      "data-[state=checked]:bg-primary/40",
      "data-[state=checked]:hover:bg-primary/50",
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
        "bg-foreground/40",
        "shadow-sm",
        "transition-transform duration-200",
        "data-[state=checked]:translate-x-[18px]",
        "data-[state=unchecked]:translate-x-0.5",
        "data-[state=checked]:bg-primary",
        "data-[state=checked]:scale-100",
        "data-[state=unchecked]:scale-95",
      )} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
