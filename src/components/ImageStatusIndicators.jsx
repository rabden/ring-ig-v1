import React from 'react'
import { Flame, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const StatusIcon = ({ children, tooltip, className }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "absolute z-[2] rounded-full p-1.5 bg-background/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform",
          className
        )}>
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const ImageStatusIndicators = ({ isTrending, isHot }) => {
  if (!isTrending && !isHot) return null;
  
  return (
    <>
      {isTrending && (
        <StatusIcon 
          tooltip="Trending"
          className="top-2 left-2"
        >
          <TrendingUp className="w-4 h-4 text-blue-500" />
        </StatusIcon>
      )}
      {isHot && (
        <StatusIcon 
          tooltip="Hot"
          className={cn(
            "top-2",
            isTrending ? "left-12" : "left-2"
          )}
        >
          <Flame className="w-4 h-4 text-red-500" />
        </StatusIcon>
      )}
    </>
  )
}

export default ImageStatusIndicators