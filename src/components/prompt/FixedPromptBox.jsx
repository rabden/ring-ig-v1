import React from 'react';
import { cn } from '@/lib/utils';

const FixedPromptBox = ({ 
  isVisible, 
  prompt, 
  onClick,
  className 
}) => {
  return (
    <div 
      className={cn(
        "hidden md:block fixed top-12 left-0 right-0 z-50 px-4 py-2",
        "transform-gpu transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        className
      )}
    >
      <div 
        className={cn(
          "relative bg-card shadow-sm border border-border/50 rounded-full cursor-pointer",
          "transform-gpu hover:shadow-md"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-4 p-1">
          <div className="flex-1 px-4 text-muted-foreground/50 truncate">
            {prompt || "A 4D HDR immersive 3D image..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedPromptBox; 