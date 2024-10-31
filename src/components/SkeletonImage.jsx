import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonImage = ({ width, height }) => {
  return (
    <div className="absolute inset-0">
      <Skeleton className="w-full h-full" />
    </div>
  );
};

export default SkeletonImage;