import React from 'react';
import { Progress } from "@/components/ui/progress";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[200]">
      <div className="text-4xl font-bold mb-8">RING IG</div>
      <div className="w-[200px]">
        <Progress value={100} className="h-2" />
      </div>
    </div>
  );
};

export default LoadingScreen;