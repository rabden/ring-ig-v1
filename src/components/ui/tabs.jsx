import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center",
      "h-10",
      "rounded-lg",
      "bg-transparent",
      "p-1",
      "text-muted-foreground/60",
      className
    )}
    {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center",
      "h-8 px-3",
      "whitespace-nowrap",
      "rounded-md",
      "text-sm font-medium",
      "ring-offset-background",
      "transition-all duration-200",
      "text-muted-foreground/60",
      "hover:text-muted-foreground/80",
      "focus:outline-none",
      "disabled:opacity-30",
      "disabled:pointer-events-none",
      "data-[state=active]:bg-accent/5",
      "data-[state=active]:text-foreground",
      "data-[state=active]:shadow-none",
      className
    )}
    {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2",
      "ring-offset-background",
      "transition-[transform,opacity] duration-200",
      "focus:outline-none",
      "data-[state=inactive]:opacity-0",
      "data-[state=inactive]:translate-y-1",
      "data-[state=active]:opacity-100",
      "data-[state=active]:translate-y-0",
      className
    )}
    {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
