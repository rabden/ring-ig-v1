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
    <div className={cn("flex gap-2", className)}>
      <Button
        variant={showFollowing ? "default" : "ghost"}
        size="sm"
        onClick={handleFollowingClick}
        className={cn(
          "h-8 text-xs px-4 rounded-xl bg-background/50 hover:bg-accent/10",
          showFollowing && "bg-primary/30 hover:bg-primary/40 text-primary-foreground",
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
          "h-8 text-xs px-4 rounded-xl bg-background/50 hover:bg-accent/10",
          showTop && "bg-primary/30 hover:bg-primary/40 text-primary-foreground",
          "transition-all duration-200"
        )}
      >
        Top
      </Button>
    </div>
  );
};

export default InspirationFilterButtons; 