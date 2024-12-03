import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { getOptimizedImageUrl } from '@/utils/imageOptimization';
import HeartAnimation from '../animations/HeartAnimation';

const ImageCardMedia = ({ 
  image = {}, // Provide default empty object
  onImageClick, 
  onDoubleClick, 
  isAnimating 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Return early if no valid image data
  if (!image || !image.storage_path) {
    return (
      <div className="relative" style={{ paddingTop: '100%' }}>
        <div className="absolute inset-0 bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  const optimizedImageUrl = getOptimizedImageUrl(image.storage_path, {
    width: 1024,
    quality: 75
  });

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const aspectRatio = image.height && image.width ? (image.height / image.width) * 100 : 100;

  return (
    <div className="relative" style={{ paddingTop: `${aspectRatio}%` }}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <img 
        src={optimizedImageUrl}
        alt={image.prompt || 'Image'} 
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