import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonImageCard = ({ aspectRatio = '1:1' }) => {
  const [width, height] = aspectRatio.split(':').map(Number);
  const paddingTop = `${(height / width) * 100}%`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative" style={{ paddingTop }}>
        <div className="absolute inset-0 flex flex-col">
          <Skeleton className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>
      </CardContent>
      <div className="mt-2 flex items-center justify-between p-2">
        <Skeleton className="h-4 w-[70%] bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
      </div>
    </Card>
  );
};

export default SkeletonImageCard;