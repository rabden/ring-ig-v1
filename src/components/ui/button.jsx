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
          "bg-primary/60",
          "text-primary-foreground",
          "hover:bg-primary/80"
        ],
        destructive: [
          "bg-destructive/60",
          "text-destructive-foreground",
          "hover:bg-destructive/80"
        ],
        outline: [
          "bg-background",
          "text-muted-foreground",
          "hover:bg-accent/20",
          "hover:text-foreground"
        ],
        secondary: [
          "bg-secondary/60",
          "text-secondary-foreground",
          "hover:bg-secondary/80"
        ],
        ghost: [
          "text-muted-foreground",
          "hover:bg-accent/20",
          "hover:text-foreground"
        ],
        subtle: [
          "bg-accent/10",
          "text-muted-foreground",
          "hover:bg-accent/20",
          "hover:text-foreground"
        ],
        link: [
          "text-primary",
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
