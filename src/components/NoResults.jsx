import React from 'react';
import { cn } from '@/lib/utils';

const NoResults = ({ message = "No results found" }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      "min-h-[200px] w-full",
      "bg-black/30 backdrop-blur-sm",
      "rounded-lg border border-white/10",
      "transition-all duration-200"
    )}>
      <p className={cn(
        "text-lg font-medium",
        "text-white/70",
        "transition-colors duration-200"
      )}>
        {message}
      </p>
    </div>
  );
};

export default NoResults;