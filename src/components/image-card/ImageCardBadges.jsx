import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

const ImageCardBadges = ({ modelName, isNsfw }) => {
  return (
    <div className="absolute bottom-3 left-3 flex gap-1.5">
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-black/30 backdrop-blur-sm text-white border-none",
          "text-[10px] md:text-[11px] py-0.5 px-2.5",
          "transition-all duration-300 hover:bg-black/40"
        )}
      >
        {modelName}
      </Badge>
      {isNsfw && (
        <Badge 
          variant="destructive" 
          className={cn(
            "text-[10px] md:text-[11px] py-0.5 px-2.5",
            "transition-all duration-300"
          )}
        >
          NSFW
        </Badge>
      )}
    </div>
  );
};

export default ImageCardBadges;