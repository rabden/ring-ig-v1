import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm",
        destructive:
          "bg-destructive/90 text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        outline:
          "border border-border/40 bg-background/50 hover:bg-accent/5 hover:border-border/80",
        secondary:
          "bg-secondary/70 text-secondary-foreground hover:bg-secondary/60",
        ghost: "hover:bg-accent/5 text-muted-foreground hover:text-foreground",
        subtle: "bg-accent/5 text-muted-foreground hover:bg-accent/10 hover:text-foreground",
        link: "text-primary/80 underline-offset-4 hover:text-primary hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
