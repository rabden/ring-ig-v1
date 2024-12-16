import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef((
  { className, orientation = "horizontal", decorative = true, ...props },
  ref
) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0",
      "bg-gradient-to-r from-border/0 via-border/30 to-border/0",
      "transition-opacity duration-200",
      "hover:opacity-80",
      orientation === "horizontal" 
        ? "h-px w-full" 
        : [
            "h-full w-px",
            "bg-gradient-to-b from-border/0 via-border/30 to-border/0"
          ],
      className
    )}
    {...props} />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
