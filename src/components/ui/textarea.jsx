import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <motion.textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-md",
          "border border-input bg-background/95",
          "px-3 py-2",
          "text-sm ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "backdrop-blur-sm",
          "transition-all duration-200",
          "resize-none",
          className
        )}
        {...props}
      />
    </motion.div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
