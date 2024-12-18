import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

const NoResults = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center",
        "min-h-[400px] p-8",
        "text-center space-y-4"
      )}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        className={cn(
          "p-4 rounded-full",
          "bg-muted/30",
          "transition-colors duration-300"
        )}
      >
        <SearchX className={cn(
          "w-8 h-8",
          "text-muted-foreground/60",
          "transition-colors duration-300"
        )} />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "text-lg font-medium",
          "text-foreground/80",
          "transition-colors duration-300"
        )}
      >
        No results found
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "text-sm text-muted-foreground",
          "max-w-[300px]",
          "transition-colors duration-300"
        )}
      >
        We couldn't find any images matching your criteria. Try adjusting your filters or search terms.
      </motion.p>
    </motion.div>
  );
};

export default NoResults;