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

  const handleLatestClick = () => {
    onFollowingChange(false);
    onTopChange(false);
  };

  // Latest is active when neither Following nor Top is active
  const isLatestActive = !showFollowing && !showTop;

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
      <Button
        variant={isLatestActive ? "default" : "ghost"}
        size="sm"
        onClick={handleLatestClick}
        className={cn(
          "h-7 text-xs px-3 rounded-lg",
          isLatestActive 
            ? "bg-primary/90 hover:bg-primary/80 text-primary-foreground shadow-sm" 
            : "bg-muted/5 hover:bg-muted/10",
          "transition-all duration-200"
        )}
      >
        Latest
      </Button>
    </div>
  );
};

export default InspirationFilterButtons; 