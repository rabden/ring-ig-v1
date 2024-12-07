import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { getOptimizedImageUrl, getResponsiveImageUrl } from '@/utils/imageOptimization';
import HeartAnimation from '../animations/HeartAnimation';
import { cn } from '@/lib/utils';

const ImageCardMedia = ({ 
  image, 
  onImageClick, 
  onDoubleClick, 
  isAnimating,
  priority = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const { small, medium, large } = getResponsiveImageUrl(image.storage_path);
  const optimizedImageUrl = getOptimizedImageUrl(image.storage_path, {
    width: 1024,
    quality: 75
  });

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setError(true);
    setIsLoading(false);
  };

  return (
    <div className="relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
      {isLoading && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      {!error ? (
        <img 
          src={optimizedImageUrl}
          srcSet={`${small} 640w, ${medium} 1280w, ${large} 1920w`}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          alt={image.prompt} 
          className={cn(
            "absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300",
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onClick={onImageClick}
          onDoubleClick={onDoubleClick}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          Failed to load image
        </div>
      )}
      
      <HeartAnimation isAnimating={isAnimating} />
    </div>
  );
};

export default ImageCardMedia;