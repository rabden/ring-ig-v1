import React from 'react'
import { Flame, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const StatusIcon = ({ children, className }) => (
  <div className={cn(
    "absolute z-10 rounded-full p-1.5 bg-background/90 backdrop-blur-sm shadow-lg",
    "transition-all duration-300 hover:scale-110 hover:bg-background",
    "animate-in fade-in-50 slide-in-from-top-4",
    className
  )}>
    {children}
  </div>
)

const ImageStatusIndicators = ({ isTrending, isHot }) => {
  if (!isTrending && !isHot) return null;
  
  return (
    <>
      {isTrending && (
        <StatusIcon className="top-2 left-2 animate-pulse">
          <TrendingUp className="w-4 h-4 text-blue-500 animate-[bounce_2s_ease-in-out_infinite]" />
        </StatusIcon>
      )}
      {isHot && (
        <StatusIcon className={cn(
          "top-2",
          isTrending ? "left-10" : "left-2",
          "animate-pulse"
        )}>
          <Flame className="w-4 h-4 text-red-500 animate-[bounce_2s_ease-in-out_infinite]" />
        </StatusIcon>
      )}
    </>
  )
}

export default ImageStatusIndicators