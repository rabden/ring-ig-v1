import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200 focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white text-black hover:bg-white/90",
        secondary:
          "border-transparent bg-white/10 text-white hover:bg-white/20",
        destructive:
          "border-transparent bg-destructive/80 text-white hover:bg-destructive",
        outline: "border-white/10 text-white hover:bg-white/10",
        ghost: "border-transparent bg-white/5 text-white hover:bg-white/10",
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