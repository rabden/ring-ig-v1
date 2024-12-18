import * as React from "react"
import { OTPInput } from "input-otp"
import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(({ className, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2", className)}
    {...props} />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ char, hasFocus, isComplete, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-10 w-10 rounded-md bg-black/30 backdrop-blur-sm transition-all duration-200",
        isComplete && "border-none bg-black/40",
        hasFocus && "border-none bg-black/50",
        className
      )}
      {...props}>
      {char && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {char}
        </div>
      )}
      {!char && hasFocus && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-0.5 animate-pulse bg-white" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" className="text-white/50" {...props}>
    -
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
