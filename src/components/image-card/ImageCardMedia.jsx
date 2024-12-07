import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import HeartAnimation from '@/components/animations/HeartAnimation';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { cn } from "@/lib/utils";

const ImageCardMedia = ({ image, onImageClick, onDoubleClick, isAnimating }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const optimizedImageUrl = getOptimizedImageUrl(image.storage_path, {
    width: 512,
    quality: 60
  });

  return (
    <div className="relative group cursor-pointer" onClick={onImageClick} onDoubleClick={onDoubleClick}>
      <AspectRatio ratio={image.width / image.height}>
        <img
          src={optimizedImageUrl}
          alt={image.prompt}
          className={cn(
            "object-cover w-full h-full rounded-sm transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </AspectRatio>
      <HeartAnimation isAnimating={isAnimating} size="small" />
    </div>
  );
};

export default ImageCardMedia;