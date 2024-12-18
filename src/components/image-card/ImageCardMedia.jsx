import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { getOptimizedImageUrl } from '@/utils/imageOptimization';
import HeartAnimation from '../animations/HeartAnimation';
import { cn } from '@/lib/utils';

const ImageCardMedia = ({ 
  image, 
  onImageClick, 
  onDoubleClick, 
  isAnimating,
  isHovered 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const optimizedImageUrl = getOptimizedImageUrl(image.storage_path, {
    width: 1024,
    quality: 75
  });

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted/40 backdrop-blur-sm">
          <Skeleton className="w-full h-full animate-pulse" />
        </div>
      )}
      <img 
        src={optimizedImageUrl}
        alt={image.prompt} 
        className={cn(
          "absolute inset-0 w-full h-full object-cover cursor-pointer transition-all duration-300",
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
          isHovered && 'brightness-95'
        )}
        onClick={onImageClick}
        onDoubleClick={onDoubleClick}
        onLoad={handleImageLoad}
        loading="lazy"
        decoding="async"
      />
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300",
        isHovered ? 'opacity-100' : 'opacity-0'
      )} />
      <HeartAnimation isAnimating={isAnimating} />
    </div>
  );
};

export default ImageCardMedia;