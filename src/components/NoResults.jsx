import React from 'react';
import { cn } from "@/lib/utils";

const NoResults = () => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      "p-8 rounded-xl",
      "bg-muted/5 border border-border/40",
      "backdrop-blur-[2px]",
      "shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
      "transition-all duration-300"
    )}>
      <p className="text-sm text-muted-foreground/70">No results found</p>
    </div>
  );
};

export default NoResults;