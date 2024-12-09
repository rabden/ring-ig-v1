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
    <div className={cn("flex gap-1", className)}>
      <Button
        variant={showFollowing ? "default" : "outline"}
        size="sm"
        onClick={handleFollowingClick}
        className={cn(
          "h-7 text-xs px-3 rounded-full",
          "md:h-8 md:px-4"
        )}
      >
        Following
      </Button>
      <Button
        variant={showTop ? "default" : "outline"}
        size="sm"
        onClick={handleTopClick}
        className={cn(
          "h-7 text-xs px-3 rounded-full",
          "md:h-8 md:px-4"
        )}
      >
        Top
      </Button>
    </div>
  );
};

export default InspirationFilterButtons; 