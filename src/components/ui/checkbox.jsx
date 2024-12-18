import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0",
        "border border-primary/50",
        "ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "rounded-sm",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-current",
          "transition-transform duration-200"
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          <Check className="h-3 w-3" />
        </motion.div>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  </motion.div>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
