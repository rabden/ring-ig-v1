import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: cn(
          "text-sm font-medium",
          "text-foreground/90",
          "transition-colors duration-200"
        ),
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0",
          "opacity-70 hover:opacity-100",
          "transition-all duration-200"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: cn(
          "text-muted-foreground",
          "rounded-md w-9 font-normal text-[0.8rem]",
          "transition-colors duration-200"
        ),
        row: "flex w-full mt-2",
        cell: cn(
          "h-9 w-9 text-center text-sm relative",
          "p-0 focus-within:relative focus-within:z-20",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent/50",
          "transition-colors duration-200"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0",
          "font-normal",
          "aria-selected:opacity-100",
          "hover:bg-accent/50 hover:text-accent-foreground",
          "focus:bg-accent/50 focus:text-accent-foreground",
          "transition-all duration-200"
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 hover:text-primary-foreground",
          "focus:bg-primary/90 focus:text-primary-foreground",
          "transition-colors duration-200"
        ),
        day_today: cn(
          "bg-accent/50 text-accent-foreground",
          "transition-colors duration-200"
        ),
        day_outside: cn(
          "text-muted-foreground opacity-50",
          "aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          "transition-colors duration-200"
        ),
        day_disabled: cn(
          "text-muted-foreground opacity-50",
          "transition-colors duration-200"
        ),
        day_range_middle: cn(
          "aria-selected:bg-accent/50",
          "aria-selected:text-accent-foreground",
          "transition-colors duration-200"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        ),
        IconRight: ({ ...props }) => (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        ),
        Day: ({ ...props }) => (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <button {...props} />
          </motion.div>
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
