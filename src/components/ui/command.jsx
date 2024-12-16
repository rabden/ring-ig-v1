import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col",
      "overflow-hidden rounded-xl",
      "bg-popover/95 backdrop-blur-sm",
      "text-popover-foreground/90",
      "border border-border/30",
      "shadow-sm shadow-primary/5",
      "transition-colors duration-200",
      className
    )}
    {...props} />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({
  children,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command
          className={cn(
            "[&_[cmdk-group-heading]]:px-2",
            "[&_[cmdk-group-heading]]:font-medium",
            "[&_[cmdk-group-heading]]:text-muted-foreground/70",
            "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",
            "[&_[cmdk-group]]:px-2",
            "[&_[cmdk-input-wrapper]_svg]:h-4",
            "[&_[cmdk-input-wrapper]_svg]:w-4",
            "[&_[cmdk-input]]:h-11",
            "[&_[cmdk-item]]:px-2",
            "[&_[cmdk-item]]:py-2.5",
            "[&_[cmdk-item]_svg]:h-4",
            "[&_[cmdk-item]_svg]:w-4"
          )}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    className={cn(
      "flex items-center",
      "border-b border-border/20",
      "px-3",
      "transition-colors duration-200"
    )} 
    cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground/50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full",
        "bg-transparent",
        "py-3 text-sm",
        "text-foreground/90",
        "placeholder:text-muted-foreground/50",
        "outline-none",
        "transition-colors duration-200",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        className
      )}
      {...props} />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[300px]",
      "overflow-y-auto overflow-x-hidden",
      "scrollbar-thin scrollbar-thumb-border/30 scrollbar-track-transparent",
      className
    )}
    {...props} />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef((props, ref) => (
  <CommandPrimitive.Empty 
    ref={ref} 
    className={cn(
      "py-6",
      "text-center text-sm",
      "text-muted-foreground/70"
    )} 
    {...props} 
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1",
      "text-foreground/90",
      "[&_[cmdk-group-heading]]:px-2",
      "[&_[cmdk-group-heading]]:py-1.5",
      "[&_[cmdk-group-heading]]:text-xs",
      "[&_[cmdk-group-heading]]:font-medium",
      "[&_[cmdk-group-heading]]:text-muted-foreground/70",
      className
    )}
    {...props} />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator 
    ref={ref} 
    className={cn(
      "-mx-1 h-px",
      "bg-border/20",
      "transition-colors duration-200",
      className
    )} 
    {...props} 
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex",
      "cursor-default select-none items-center",
      "rounded-lg px-2 py-2.5",
      "text-sm text-muted-foreground/90",
      "transition-colors duration-200",
      "outline-none",
      "data-[disabled=true]:pointer-events-none",
      "data-[disabled=true]:opacity-50",
      "data-[selected=true]:bg-accent/5",
      "data-[selected=true]:text-accent-foreground",
      className
    )}
    {...props} />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs",
        "tracking-widest",
        "text-muted-foreground/50",
        className
      )}
      {...props} />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
