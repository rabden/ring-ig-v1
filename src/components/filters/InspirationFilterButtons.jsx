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
  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        variant={showFollowing ? "default" : "outline"}
        size="sm"
        onClick={() => onFollowingChange(!showFollowing)}
        className="rounded-full text-xs"
      >
        Following
      </Button>
      <Button
        variant={showTop ? "default" : "outline"}
        size="sm"
        onClick={() => onTopChange(!showTop)}
        className="rounded-full text-xs"
      >
        Top
      </Button>
    </div>
  );
};

export default InspirationFilterButtons; 