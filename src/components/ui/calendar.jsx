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
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 p-0 text-white/50 hover:text-white bg-transparent hover:bg-black/30 transition-all duration-200"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-white/50 w-9 font-normal text-[0.8rem] transition-colors duration-200",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-black/30 first:[&:has([aria-selected])]:rounded-md last:[&:has([aria-selected])]:rounded-md focus-within:relative focus-within:z-20 transition-all duration-200",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-white/70 hover:text-white hover:bg-black/30 backdrop-blur-sm transition-all duration-200"
        ),
        day_selected:
          "bg-black/40 text-white hover:bg-black/50 hover:text-white backdrop-blur-sm",
        day_today: "bg-black/30 text-white font-medium backdrop-blur-sm",
        day_outside:
          "text-white/30 hover:text-white/50 transition-colors duration-200",
        day_disabled: "text-white/30",
        day_range_middle:
          "aria-selected:bg-black/30 aria-selected:text-white backdrop-blur-sm",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
