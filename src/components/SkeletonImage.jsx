import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonImage = ({ width, height }) => {
  return (
    <Skeleton className="w-full h-full" style={{ paddingTop: `${(height / width) * 100}%` }} />
  );
};

export default SkeletonImage;