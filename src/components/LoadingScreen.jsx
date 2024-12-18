import React from 'react';
import { cn } from '@/lib/utils';

const LoadingScreen = () => {
  return (
    <div className={cn(
      "fixed inset-0 z-50",
      "bg-black/80 backdrop-blur-sm",
      "flex items-center justify-center",
      "transition-opacity duration-200"
    )}>
      <div className={cn(
        "flex flex-col items-center gap-4",
        "text-white/80"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-full",
          "border-4 border-white/20 border-t-white/80",
          "animate-spin"
        )} />
        <p className={cn(
          "text-sm font-medium",
          "animate-pulse"
        )}>
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;