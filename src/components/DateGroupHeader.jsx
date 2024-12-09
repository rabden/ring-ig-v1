import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const DateGroupHeader = ({ title, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "sticky top-16 z-10 bg-background/40 backdrop-blur-sm",
        "py-3 px-6",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-foreground/80">{title}</h2>
        <div className="flex-1 h-[1px] bg-border/30" />
      </div>
    </motion.div>
  );
};

export default DateGroupHeader; 