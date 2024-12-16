import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center",
    "rounded-full",
    "px-2.5 py-0.5",
    "text-xs font-medium",
    "transition-colors duration-200",
    "focus:outline-none"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary/20",
          "text-primary-foreground/90",
          "hover:bg-primary/30"
        ],
        secondary: [
          "bg-secondary/20",
          "text-secondary-foreground/90",
          "hover:bg-secondary/30"
        ],
        destructive: [
          "bg-destructive/20",
          "text-destructive-foreground/90",
          "hover:bg-destructive/30"
        ],
        outline: [
          "bg-background/50",
          "text-muted-foreground/60",
          "hover:bg-accent/5",
          "hover:text-muted-foreground/80"
        ],
        ghost: [
          "text-muted-foreground/60",
          "hover:bg-accent/5",
          "hover:text-muted-foreground/80"
        ],
        subtle: [
          "bg-accent/5",
          "text-muted-foreground/60",
          "hover:bg-accent/10",
          "hover:text-muted-foreground/80"
        ],
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