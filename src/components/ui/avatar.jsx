import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0",
      "h-10 w-10",
      "overflow-hidden rounded-full",
      "ring-1 ring-border/20",
      "bg-muted/50",
      "transition-all duration-200",
      "hover:ring-border/40",
      className
    )}
    {...props} />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full",
      "object-cover",
      "transition-opacity duration-200",
      className
    )}
    {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full",
      "items-center justify-center",
      "rounded-full",
      "bg-muted/50 backdrop-blur-sm",
      "text-muted-foreground/70",
      "text-sm font-medium",
      "transition-colors duration-200",
      className
    )}
    {...props} />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
