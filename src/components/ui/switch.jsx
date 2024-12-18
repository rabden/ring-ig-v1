import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "border-2 border-transparent",
        "bg-input shadow-sm",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary",
        "hover:bg-input/90 data-[state=checked]:hover:bg-primary/90",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full",
          "bg-background shadow-lg ring-0",
          "transition-all duration-200",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          "data-[state=checked]:bg-primary-foreground",
          "group-hover:scale-105"
        )}
        asChild
      >
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  </motion.div>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
