import React from 'react';
import { cn } from "@/lib/utils";

const HeartAnimation = ({ isAnimating }) => {
  if (!isAnimating) return null;

  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center",
      "pointer-events-none z-10"
    )}>
      <video
        src="/heartanim.webm"
        autoPlay
        muted
        className="w-[200px] h-[200px]"
        onEnded={(e) => {
          e.target.currentTime = 0;
          e.target.pause();
        }}
      />
    </div>
  );
};

export default HeartAnimation;