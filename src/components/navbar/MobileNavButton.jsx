import React, { memo, useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

const MobileNavButton = ({ icon: Icon, isActive, onClick, children, badge, onLongPress, asChild }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef(null);
  const touchStartTime = useRef(0);
  const isMoved = useRef(false);

  const handleTouchStart = (e) => {
    isMoved.current = false;
    touchStartTime.current = Date.now();
    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        if (!isMoved.current) {
          setIsPressed(true);
          onLongPress();
        }
      }, 500);
    }
  };

  const handleTouchMove = () => {
    isMoved.current = true;
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      setIsPressed(false);
    }
  };

  const handleTouchEnd = (e) => {
    const touchDuration = Date.now() - touchStartTime.current;
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setIsPressed(false);

    // Only trigger click if it wasn't a long press and the touch didn't move
    if (touchDuration < 500 && !isMoved.current) {
      onClick?.(e);
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  const ButtonComponent = asChild ? 'div' : 'button';

  return (
    <ButtonComponent
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        // Only handle click for non-touch devices
        if (e.pointerType !== 'touch') {
          onClick?.(e);
        }
      }}
      className={cn(
        "flex items-center justify-center w-14 h-12 transition-all relative",
        isActive ? "text-primary" : "text-muted-foreground",
        "relative group"
      )}
    >
      <div className={cn(
        "absolute inset-x-2 h-0.5 -top-1 rounded-full transition-all",
        isActive ? "bg-primary" : "bg-transparent"
      )} />
      {children || (
        <>
          <Icon size={20} className={cn(
            "transition-transform duration-200",
            isActive ? "scale-100" : "scale-90 group-hover:scale-100"
          )} />
          {badge > 0 && (
            <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </>
      )}
    </ButtonComponent>
  );
};

export default memo(MobileNavButton);