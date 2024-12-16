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
    "transition-all duration-200",
    "focus-visible:outline-none",
    "disabled:pointer-events-none",
    "disabled:opacity-40",
    "active:scale-[0.98]"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary/90",
          "text-primary-foreground",
          "hover:bg-primary",
          "border border-primary/20"
        ],
        destructive: [
          "bg-destructive/90",
          "text-destructive-foreground",
          "hover:bg-destructive",
          "border border-destructive/20"
        ],
        outline: [
          "bg-background/90",
          "text-foreground/90",
          "border border-border/30",
          "hover:bg-accent/30",
          "hover:text-foreground",
          "hover:border-border/40"
        ],
        secondary: [
          "bg-secondary/90",
          "text-secondary-foreground",
          "hover:bg-secondary",
          "border border-secondary/20"
        ],
        ghost: [
          "text-foreground/80",
          "hover:bg-accent/30",
          "hover:text-foreground"
        ],
        subtle: [
          "bg-accent/30",
          "text-foreground/80",
          "border border-border/20",
          "hover:bg-accent/40",
          "hover:text-foreground",
          "hover:border-border/30"
        ],
        link: [
          "text-primary/90",
          "underline-offset-4",
          "hover:text-primary",
          "hover:underline"
        ],
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
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
