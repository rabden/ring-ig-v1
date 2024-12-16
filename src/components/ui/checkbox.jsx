import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0",
      "rounded-lg border border-border/40",
      "bg-background/50",
      "ring-offset-background",
      "transition-all duration-200",
      // Hover state
      "hover:border-border/80",
      "hover:bg-accent/5",
      // Focus state
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-ring/30",
      "focus-visible:ring-offset-2",
      // Checked state
      "data-[state=checked]:bg-primary/90",
      "data-[state=checked]:border-primary/90",
      "data-[state=checked]:text-primary-foreground",
      // Disabled state
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator 
      className={cn(
        "flex items-center justify-center text-current",
        "text-primary-foreground/90",
        "transition-transform duration-200",
        "data-[state=checked]:scale-100",
        "data-[state=unchecked]:scale-0"
      )}>
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
