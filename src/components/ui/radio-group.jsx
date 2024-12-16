import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root 
      className={cn(
        "grid gap-2",
        className
      )} 
      {...props} 
      ref={ref} 
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4",
        "rounded-full border border-border/40",
        "bg-background/50",
        "text-primary",
        "ring-offset-background",
        "transition-all duration-200",
        // Hover state
        "hover:border-border/80",
        "hover:bg-accent/5",
        // Focus state
        "focus:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring/30",
        "focus-visible:ring-offset-2",
        // Checked state
        "data-[state=checked]:border-primary/90",
        "data-[state=checked]:bg-primary/10",
        // Disabled state
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        className
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator className={cn(
        "flex items-center justify-center",
        "transition-transform duration-200",
        "data-[state=checked]:scale-100",
        "data-[state=unchecked]:scale-0"
      )}>
        <Circle 
          className={cn(
            "h-2 w-2 fill-primary text-primary",
            "opacity-90",
            "transition-colors duration-200"
          )} 
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
