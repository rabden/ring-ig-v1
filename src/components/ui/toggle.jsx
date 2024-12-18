import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const toggleVariants = cva(
  cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background",
    "transition-all duration-200",
    "hover:bg-muted/50 hover:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=on]:bg-accent/50 data-[state=on]:text-accent-foreground"
  ),
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: cn(
          "border border-input",
          "hover:bg-accent/50 hover:text-accent-foreground",
          "data-[state=on]:bg-accent/50 data-[state=on]:text-accent-foreground"
        ),
        ghost: cn(
          "hover:bg-accent/30",
          "data-[state=on]:bg-accent/50 data-[state=on]:text-accent-foreground"
        ),
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props} />
  </motion.div>
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
