import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Progress = React.forwardRef(({ className, value, max = 100, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full",
      "bg-secondary/20",
      "transition-all duration-200",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value || 0}%` }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full w-full flex-1 bg-primary"
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full",
          "flex-1",
          "bg-gradient-to-r from-primary/90 to-primary",
          "transition-all duration-200"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      >
        <motion.div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent",
            "opacity-50"
          )}
          animate={{
            x: ["0%", "200%"],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </ProgressPrimitive.Indicator>
    </motion.div>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }