import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const InspirationFilterButtons = ({ 
  showFollowing,
  showTop,
  onFollowingChange,
  onTopChange,
  className
}) => {
  const handleFollowingClick = () => {
    if (showFollowing) {
      onFollowingChange(false);
    } else {
      onFollowingChange(true);
      onTopChange(false);
    }
  };

  const handleTopClick = () => {
    if (showTop) {
      onTopChange(false);
    } else {
      onTopChange(true);
      onFollowingChange(false);
    }
  };

  return (
    <div className={cn("flex gap-1.5", className)}>
      <Button
        variant={showFollowing ? "default" : "ghost"}
        size="sm"
        onClick={handleFollowingClick}
        className={cn(
          "h-7 text-xs px-3 rounded-lg",
          showFollowing 
            ? "bg-primary/90 hover:bg-primary/80 text-primary-foreground shadow-sm" 
            : "bg-muted/5 hover:bg-muted/10",
          "transition-all duration-200"
        )}
      >
        Following
      </Button>
      <Button
        variant={showTop ? "default" : "ghost"}
        size="sm"
        onClick={handleTopClick}
        className={cn(
          "h-7 text-xs px-3 rounded-lg",
          showTop 
            ? "bg-primary/90 hover:bg-primary/80 text-primary-foreground shadow-sm" 
            : "bg-muted/5 hover:bg-muted/10",
          "transition-all duration-200"
        )}
      >
        Top
      </Button>
    </div>
  );
};

export default InspirationFilterButtons; 