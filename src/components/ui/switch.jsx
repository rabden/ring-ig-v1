import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full",
      "bg-muted/30 hover:bg-muted/40",
      "transition-all duration-300",
      "focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-primary/40",
      "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary/50 data-[state=checked]:hover:bg-primary/60",
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block rounded-full",
        "bg-background shadow-md",
        "ring-2 ring-border/20 ring-offset-1 ring-offset-background",
        "transition-all duration-300 ease-in-out",
        "data-[state=unchecked]:h-5 data-[state=unchecked]:w-5",
        "data-[state=unchecked]:translate-x-1",
        "data-[state=checked]:h-6 data-[state=checked]:w-6",
        "data-[state=checked]:translate-x-5",
        "data-[state=checked]:bg-background",
        "data-[state=checked]:ring-primary/30"
      )} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
