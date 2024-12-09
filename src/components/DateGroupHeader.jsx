import React from 'react';
import { cn } from '@/lib/utils';

const DateGroupHeader = ({ title, className }) => {
  return (
    <div className={cn(
      "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "py-2 px-4 mb-4",
      "border-b",
      className
    )}>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

export default DateGroupHeader; 