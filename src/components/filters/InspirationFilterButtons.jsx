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

  const buttonClasses = (isActive) => cn(
    "h-8 md:h-9 text-xs md:text-sm px-4 transition-all duration-200",
    "hover:bg-accent/40 hover:text-accent-foreground",
    isActive && "bg-accent/30 text-accent-foreground shadow-sm"
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        onClick={handleFollowingClick}
        className={buttonClasses(showFollowing)}
      >
        Following
      </Button>
      <Button
        variant="ghost"
        onClick={handleTopClick}
        className={buttonClasses(showTop)}
      >
        Top
      </Button>
    </div>
  );
};

export default InspirationFilterButtons; 