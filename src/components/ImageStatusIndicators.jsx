import React from 'react'
import { Flame, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const StatusIcon = ({ children, className }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className={cn(
      "absolute z-[2] rounded-full p-1.5",
      "bg-background/80 backdrop-blur-sm",
      "shadow-sm border border-border/10",
      "transition-all duration-200",
      "hover:bg-background/90 hover:shadow-md",
      className
    )}
  >
    {children}
  </motion.div>
)

const ImageStatusIndicators = ({ isTrending, isHot }) => {
  if (!isTrending && !isHot) return null;
  
  return (
    <>
      {isTrending && (
        <StatusIcon className="top-3 left-3">
          <TrendingUp className={cn(
            "w-3.5 h-3.5 text-blue-500",
            "transition-colors duration-200",
            "group-hover:text-blue-600"
          )} />
        </StatusIcon>
      )}
      {isHot && (
        <StatusIcon className={cn(
          "top-3",
          isTrending ? "left-12" : "left-3",
          "transition-all duration-300"
        )}>
          <Flame className={cn(
            "w-3.5 h-3.5 text-red-500",
            "transition-colors duration-200",
            "group-hover:text-red-600"
          )} />
        </StatusIcon>
      )}
    </>
  )
}

export default ImageStatusIndicators