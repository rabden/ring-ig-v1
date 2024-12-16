import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "whitespace-nowrap",
    "rounded-xl",
    "text-sm font-medium",
    "transition-colors duration-200",
    "focus:outline-none",
    "disabled:pointer-events-none",
    "disabled:opacity-30"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary/20",
          "text-primary-foreground",
          "hover:bg-primary/30"
        ],
        destructive: [
          "bg-destructive/20",
          "text-destructive-foreground",
          "hover:bg-destructive/30"
        ],
        outline: [
          "bg-background/50",
          "text-muted-foreground/60",
          "hover:bg-accent/5",
          "hover:text-muted-foreground/80"
        ],
        secondary: [
          "bg-secondary/20",
          "text-secondary-foreground",
          "hover:bg-secondary/30"
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
        link: [
          "text-primary/60",
          "underline-offset-4",
          "hover:text-primary/80",
          "hover:underline"
        ],
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
