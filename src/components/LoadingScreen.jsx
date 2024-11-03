import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1000; // 1 second

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      if (newProgress < 100) {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[200]">
      <div className="text-4xl font-bold mb-8">RING IG</div>
      <div className="w-[200px]">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default LoadingScreen;