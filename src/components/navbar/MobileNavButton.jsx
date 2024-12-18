import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from '@/lib/utils';

const MobileNavButton = ({ 
  icon: Icon, 
  isActive, 
  onClick, 
  onLongPress,
  badge,
  showCheckmark
}) => {
  let pressTimer;

  const handleMouseDown = () => {
    if (!onLongPress) return;
    pressTimer = setTimeout(() => {
      onLongPress();
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative h-12 w-12",
          "bg-transparent",
          "transition-all duration-200",
          isActive ? (
            "text-white opacity-100"
          ) : (
            "text-white/70 hover:text-white opacity-70 hover:opacity-100"
          )
        )}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <Icon className="h-5 w-5" />
        
        {/* Badge */}
        {badge > 0 && (
          <span className={cn(
            "absolute -top-0.5 -right-0.5",
            "min-w-[1.25rem] h-5",
            "flex items-center justify-center",
            "rounded-full px-1",
            "bg-white text-black",
            "text-xs font-medium",
            "transition-all duration-200"
          )}>
            {badge}
          </span>
        )}

        {/* Checkmark Animation */}
        {showCheckmark && (
          <span className={cn(
            "absolute inset-0",
            "flex items-center justify-center",
            "bg-green-500/90 text-white",
            "rounded-full",
            "animate-checkmark"
          )}>
            <Check className="h-5 w-5" />
          </span>
        )}
      </Button>

      {/* Active Indicator */}
      {isActive && (
        <div className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2",
          "h-0.5 w-6",
          "bg-white rounded-full",
          "transition-all duration-200"
        )} />
      )}
    </div>
  );
};

export default MobileNavButton;