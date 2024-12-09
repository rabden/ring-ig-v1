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
        "sticky top-0 z-10",
        "py-2 px-4",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        <div className="flex-1 h-[1px] bg-border/20" />
      </div>
    </motion.div>
  );
};

export default DateGroupHeader; 