import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-4",
      className
    )}
    {...props}>
    <SliderPrimitive.Track
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full",
        "bg-secondary/30 hover:bg-secondary/40",
        "transition-colors duration-200"
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
          "absolute h-full bg-primary/40",
          "transition-colors duration-200"
        )} 
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-5 w-5 rounded-full border border-border/20",
        "bg-background shadow-sm ring-1 ring-border/10",
        "transition-all duration-200",
        "hover:scale-110 hover:bg-background/90",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/30",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
