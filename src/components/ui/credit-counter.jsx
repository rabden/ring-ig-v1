import * as React from "react"
import { cn } from "@/lib/utils"

const CreditCounter = React.forwardRef(({ className, credits, bonusCredits, ...props }, ref) => {
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-8 items-center rounded-md bg-black/30 px-3 text-sm text-white backdrop-blur-sm",
        className
      )}
      {...props}>
      {totalCredits} credits
    </div>
  );
})

CreditCounter.displayName = "CreditCounter"

export default CreditCounter