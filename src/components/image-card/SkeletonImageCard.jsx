import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonImageCard = () => {
  return (
    <div className="mb-2">
      <div className="overflow-hidden rounded-sm">
        <div className="relative" style={{ paddingTop: '100%' }}>
          <Skeleton className="absolute inset-0 w-full h-full" />
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonImageGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(8).fill(null).map((_, index) => (
        <SkeletonImageCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonImageCard; 