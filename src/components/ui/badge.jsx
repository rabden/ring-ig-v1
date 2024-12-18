import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-none bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "border-none bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
        destructive:
          "border-none bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline:
          "text-foreground border-none bg-background/50 backdrop-blur-sm hover:bg-accent/50",
        success:
          "border-none bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20",
        warning:
          "border-none bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20",
        info:
          "border-none bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />)
}

export { Badge, badgeVariants }