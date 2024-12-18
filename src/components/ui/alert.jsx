import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const alertVariants = cva(
  cn(
    "relative w-full",
    "rounded-lg border p-4",
    "shadow-sm transition-all duration-200",
    "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-background text-foreground",
          "border-border/50",
          "hover:border-border",
          "dark:border-border/30 dark:hover:border-border/50"
        ),
        destructive: cn(
          "border-destructive/30 text-destructive",
          "dark:border-destructive/30",
          "[&>svg]:text-destructive"
        ),
        success: cn(
          "border-emerald-500/30 text-emerald-600",
          "dark:border-emerald-500/30 dark:text-emerald-400",
          "[&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400"
        ),
        warning: cn(
          "border-amber-500/30 text-amber-600",
          "dark:border-amber-500/30 dark:text-amber-400",
          "[&>svg]:text-amber-600 dark:[&>svg]:text-amber-400"
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, children, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    role="alert"
    ref={ref}
    className={cn(alertVariants({ variant }), className)}
    {...props}
  >
    {children}
  </motion.div>
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.h5
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    ref={ref}
    className={cn(
      "mb-1 font-medium leading-none tracking-tight",
      "transition-colors duration-200",
      className
    )}
    {...props}
  >
    {children}
  </motion.h5>
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    ref={ref}
    className={cn(
      "text-sm [&_p]:leading-relaxed",
      "text-foreground/80",
      "transition-colors duration-200",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
