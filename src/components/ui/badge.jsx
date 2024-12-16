import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/90 text-primary-foreground hover:bg-primary/80 shadow-sm",
        secondary:
          "border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary/70 shadow-sm",
        destructive:
          "border-transparent bg-destructive/90 text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        outline: 
          "border-border/40 bg-background/50 text-muted-foreground hover:bg-accent/5 hover:text-foreground hover:border-border/80",
        ghost:
          "border-transparent text-muted-foreground hover:bg-accent/5 hover:text-foreground",
        subtle:
          "border-transparent bg-accent/5 text-muted-foreground hover:bg-accent/10 hover:text-foreground",
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