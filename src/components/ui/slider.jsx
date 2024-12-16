import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      "data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <SliderPrimitive.Track
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full",
        "bg-secondary/20 dark:bg-secondary/10",
        "transition-colors duration-200"
      )}>
      <SliderPrimitive.Range 
        className={cn(
          "absolute h-full bg-primary/90",
          "transition-[background-color,transform] duration-200",
          "data-[disabled]:opacity-50"
        )} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full border border-primary/50 bg-background",
        "shadow-sm shadow-primary/10",
        "transition-all duration-200",
        "hover:scale-110 hover:border-primary/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50"
      )} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
