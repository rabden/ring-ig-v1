import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import HeartAnimation from './animations/HeartAnimation';

const LikeButton = ({ isLiked, onToggle, className }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsAnimating(true);
    }
    onToggle();
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-6 w-6 p-0", className)}
        onClick={handleClick}
      >
        <Heart 
          className={cn(
            "h-4 w-4",
            isLiked ? "fill-red-500 text-red-500" : "text-foreground"
          )} 
        />
      </Button>
      <HeartAnimation isAnimating={isAnimating} />
    </div>
  );
};

export default LikeButton;