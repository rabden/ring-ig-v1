import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const LikeButton = ({ isLiked, onToggle, className }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6 p-0", className)}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isLiked ? "fill-red-500 text-red-500" : "text-foreground"
        )} 
      />
    </Button>
  );
};

export default LikeButton;