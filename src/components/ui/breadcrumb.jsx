import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef(
  ({ className, ...props }, ref) => (
    <nav 
      ref={ref} 
      aria-label="breadcrumb" 
      className={cn(
        "relative",
        "flex items-center",
        "min-h-[40px]",
        "px-1",
        className
      )}
      {...props} 
    />
  )
)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center",
      "gap-1.5 sm:gap-2",
      "break-words",
      "text-sm",
      "text-muted-foreground/70",
      className
    )}
    {...props} />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "inline-flex items-center",
      "gap-1.5",
      "transition-colors duration-200",
      className
    )}
    {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    (<Comp
      ref={ref}
      className={cn(
        "rounded-md",
        "px-2 py-1",
        "text-muted-foreground/90",
        "transition-colors duration-200",
        "hover:bg-accent/5",
        "hover:text-accent-foreground",
        "focus:bg-accent/5",
        "focus:text-accent-foreground",
        "focus:outline-none",
        className
      )}
      {...props} />)
  );
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(
      "rounded-md",
      "px-2 py-1",
      "font-medium",
      "text-foreground/90",
      "bg-accent/5",
      className
    )}
    {...props} />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(
      "[&>svg]:h-4 [&>svg]:w-4",
      "text-muted-foreground/30",
      className
    )}
    {...props}>
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      "flex items-center justify-center",
      "h-9 w-9",
      "rounded-md",
      "text-muted-foreground/50",
      "transition-colors duration-200",
      "hover:bg-accent/5",
      "hover:text-muted-foreground/70",
      className
    )}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
