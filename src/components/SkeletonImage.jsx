import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const SkeletonImage = ({ width, height, className }) => {
  const aspectRatio = (height / width) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "relative overflow-hidden rounded-lg",
        "bg-muted/50",
        "transition-all duration-300",
        className
      )}
      style={{ paddingTop: `${aspectRatio}%` }}
    >
      <Skeleton 
        className={cn(
          "absolute inset-0 w-full h-full",
          "animate-pulse",
          "bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30",
          "bg-[length:200%_100%]",
          "transition-all duration-300"
        )}
      />
    </motion.div>
  );
};

export default SkeletonImage;