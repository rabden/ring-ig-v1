import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const SkeletonImageCard = ({ width = 512, height = 512, className }) => {
  const aspectRatio = (height / width) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn("mb-4", className)}
    >
      <Card className={cn(
        "overflow-hidden",
        "bg-card/50 backdrop-blur-sm",
        "border-border/30",
        "transition-all duration-300",
        "hover:shadow-lg hover:border-border/50"
      )}>
        <CardContent className={cn(
          "p-0 relative",
          "overflow-hidden"
        )} style={{ paddingTop: `${aspectRatio}%` }}>
          <Skeleton className={cn(
            "absolute inset-0 w-full h-full",
            "animate-pulse",
            "bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30",
            "bg-[length:200%_100%]",
            "transition-all duration-300"
          )} />
        </CardContent>
      </Card>
      <div className={cn(
        "mt-3 flex items-center justify-between",
        "transition-opacity duration-300"
      )}>
        <div className="space-y-2 flex-1">
          <Skeleton className={cn(
            "h-4 w-3/4",
            "bg-muted/40",
            "transition-all duration-300"
          )} />
          <Skeleton className={cn(
            "h-3 w-1/2",
            "bg-muted/30",
            "transition-all duration-300"
          )} />
        </div>
        <Skeleton className={cn(
          "h-8 w-8 rounded-full ml-4",
          "bg-muted/40",
          "transition-all duration-300"
        )} />
      </div>
    </motion.div>
  )
}

export default SkeletonImageCard