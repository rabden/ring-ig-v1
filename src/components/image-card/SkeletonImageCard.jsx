import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const SkeletonImageCard = () => {
  // Random aspect ratio for more natural look
  const aspectRatio = [1, 4/3, 3/4, 16/9][Math.floor(Math.random() * 4)];

  return (
    <div className="mb-2 animate-pulse">
      <div className="overflow-hidden rounded-sm">
        <AspectRatio ratio={aspectRatio}>
          <Skeleton className="w-full h-full" />
        </AspectRatio>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <Skeleton className="h-4 w-[70%]" />
        <div className="flex gap-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
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