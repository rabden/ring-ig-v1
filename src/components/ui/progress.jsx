import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-1.5 w-full",
      "overflow-hidden rounded-full",
      "bg-secondary/20",
      "ring-1 ring-border/20",
      "transition-colors duration-200",
      className
    )}
    {...props}>
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1",
        "bg-gradient-to-r from-primary/80 to-primary/90",
        "transition-all duration-300 ease-in-out",
        "shadow-sm shadow-primary/10"
      )}
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        willChange: "transform"
      }} />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }