import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  [
    "relative w-full",
    "rounded-xl border border-border/30",
    "p-4",
    "bg-background/95 backdrop-blur-sm",
    "shadow-sm shadow-primary/5",
    "transition-colors duration-200",
    // Icon styles
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "[&>svg]:h-4 [&>svg]:w-4",
    "[&>svg]:text-foreground/70",
    "[&>svg~*]:pl-7",
    "[&>svg+div]:translate-y-[-3px]",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-foreground/90",
          "hover:border-border/50",
        ],
        destructive: [
          "border-destructive/30",
          "text-destructive dark:border-destructive/40",
          "[&>svg]:text-destructive/70",
          "hover:border-destructive/50",
        ],
        success: [
          "border-green-500/30",
          "text-green-500 dark:border-green-500/40",
          "[&>svg]:text-green-500/70",
          "hover:border-green-500/50",
        ],
        warning: [
          "border-yellow-500/30",
          "text-yellow-500 dark:border-yellow-500/40",
          "[&>svg]:text-yellow-500/70",
          "hover:border-yellow-500/50",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props} />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-medium",
      "leading-none tracking-tight",
      "text-current",
      className
    )}
    {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm",
      "text-current/90",
      "[&_p]:leading-relaxed",
      className
    )}
    {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
