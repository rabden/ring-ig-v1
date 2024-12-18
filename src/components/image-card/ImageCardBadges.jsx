import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

const ImageCardBadges = ({ modelName, isNsfw }) => {
  return (
    <div className={cn(
      "absolute bottom-2 left-2 flex flex-wrap gap-1.5",
      "transition-opacity duration-200",
      "opacity-80 group-hover:opacity-100"
    )}>
      <Badge variant="ghost" className={cn(
        "bg-black/40 backdrop-blur-sm",
        "text-white/80 group-hover:text-white",
        "border border-white/10",
        "transition-all duration-200"
      )}>
        {modelName}
      </Badge>
      {isNsfw && (
        <Badge variant="ghost" className={cn(
          "bg-red-500/40 backdrop-blur-sm",
          "text-white/80 group-hover:text-white",
          "border border-red-500/20",
          "transition-all duration-200"
        )}>
          NSFW
        </Badge>
      )}
    </div>
  );
};

export default ImageCardBadges;