import React from 'react';
import { Progress } from "@/components/ui/progress";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-8 transition-opacity duration-500">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-white">Ring IG</h1>
        <img 
          src="/og-image.svg" 
          alt="Ring IG Logo" 
          className="w-24 h-24"
        />
      </div>
      <Progress value={100} className="w-64 animate-pulse" />
    </div>
  );
};

export default LoadingScreen;