import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    (<DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4",
        "rounded-xl border border-border/30",
        "bg-background/95 backdrop-blur-sm",
        "shadow-sm shadow-primary/5",
        "transition-colors duration-200",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-foreground/90",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8",
          "p-0",
          "text-muted-foreground/50",
          "hover:text-muted-foreground/70",
          "transition-colors duration-200",
          "rounded-lg",
          "hover:bg-accent/5",
          "focus:bg-accent/5",
          "focus:outline-none"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: cn(
          "text-muted-foreground/70",
          "rounded-md",
          "w-10",
          "font-normal text-[0.8rem]",
          "transition-colors duration-200"
        ),
        row: "flex w-full mt-2",
        cell: cn(
          "relative",
          "h-10 w-10",
          "p-0",
          "text-center",
          "[&:has([aria-selected].day-range-end)]:rounded-r-lg",
          "[&:has([aria-selected].day-outside)]:bg-accent/5",
          "[&:has([aria-selected])]:bg-accent/5",
          "first:[&:has([aria-selected])]:rounded-l-lg",
          "last:[&:has([aria-selected])]:rounded-r-lg",
          "focus-within:relative focus-within:z-20",
          "transition-colors duration-200"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10",
          "p-0",
          "font-normal",
          "text-sm text-muted-foreground/90",
          "rounded-lg",
          "transition-colors duration-200",
          "hover:bg-accent/5",
          "hover:text-accent-foreground",
          "focus:bg-accent/5",
          "focus:text-accent-foreground",
          "focus:outline-none",
          "aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-primary/10",
          "text-primary",
          "hover:bg-primary/20",
          "hover:text-primary",
          "focus:bg-primary/20",
          "focus:text-primary"
        ),
        day_today: cn(
          "bg-accent/5",
          "text-accent-foreground",
          "font-medium"
        ),
        day_outside: cn(
          "day-outside",
          "text-muted-foreground/30",
          "hover:text-muted-foreground/50",
          "aria-selected:bg-accent/5",
          "aria-selected:text-muted-foreground/50"
        ),
        day_disabled: "text-muted-foreground/30",
        day_range_middle: cn(
          "aria-selected:bg-accent/5",
          "aria-selected:text-accent-foreground"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4" {...props} />
        ),
      }}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
