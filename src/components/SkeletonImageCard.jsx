import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonImageCard = ({ aspectRatio = '1:1' }) => {
  const [width, height] = aspectRatio.split(':').map(Number);
  const paddingTop = `${(height / width) * 100}%`;

  return (
    <div className="space-y-2">
      <div className="relative" style={{ paddingTop }}>
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 flex-grow" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonImageCard;