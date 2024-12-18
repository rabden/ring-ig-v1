import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const LikeButton = ({ isLiked, onToggle, className }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-7 w-7 p-0 transition-all duration-200",
        "hover:bg-accent/40 hover:text-accent-foreground",
        "focus-visible:ring-1 focus-visible:ring-ring",
        "group",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-all duration-200 ease-spring",
          isLiked ? 
            "fill-red-500 text-red-500 scale-110" : 
            "text-foreground group-hover:scale-105 group-active:scale-95"
        )} 
      />
    </Button>
  );
};

export default LikeButton;