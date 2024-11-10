import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 2;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-8 transition-opacity duration-500">
      <div className="flex flex-col items-center gap-6">
        <img 
          src="/logo.jpg" 
          alt="Ring IG Logo" 
          className="w-24 h-24 rounded-full"
        />
        <h1 className="text-4xl font-bold text-white">Ring IG</h1>
        <Progress value={progress} className="w-64 h-1" />
      </div>
    </div>
  );
};

export default LoadingScreen;