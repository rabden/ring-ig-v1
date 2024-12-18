import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { getOptimizedImageUrl } from '@/utils/imageOptimization';
import HeartAnimation from '../animations/HeartAnimation';

const ImageCardMedia = ({ 
  image, 
  onImageClick, 
  onDoubleClick, 
  isAnimating 
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
    <div className="relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <img 
        src={optimizedImageUrl}
        alt={image.prompt} 
        className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={onImageClick}
        onDoubleClick={onDoubleClick}
        onLoad={handleImageLoad}
        loading="lazy"
        decoding="async"
      />
      <HeartAnimation isAnimating={isAnimating} />
    </div>
  );
};

export default ImageCardMedia;