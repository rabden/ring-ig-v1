import React from 'react';
import { cn } from "@/lib/utils";
import { Zap, Star } from "lucide-react";

const ImageDetailsSection = ({ detailItems }) => {
  const getGenerationModeIcon = (mode) => {
    if (mode === 'fast') {
      return <Zap className="h-3.5 w-3.5 text-yellow-500 inline-block mr-1" />;
    }
    if (mode === 'quality') {
      return <Star className="h-3.5 w-3.5 text-blue-500 inline-block mr-1" />;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {detailItems.map((item, index) => (
        <div 
          key={index} 
          className={cn(
            "space-y-1 p-2 rounded-md",
            "bg-muted/5 hover:bg-muted/10",
            "border border-border/5",
            "transition-colors duration-200",
            "group"
          )}
        >
          <p className="text-xs text-foreground/40 uppercase tracking-wider group-hover:text-muted-foreground/70 transition-colors duration-200">
            {item.label}
          </p>
          <p className="text-sm font-medium text-foreground/90 capitalize flex items-center">
            {item.label === "Generation Mode" && getGenerationModeIcon(item.value)}
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ImageDetailsSection;