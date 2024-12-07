import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import HeartAnimation from '@/components/animations/HeartAnimation';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

const ImageCardMedia = ({ image, onImageClick, onDoubleClick, isAnimating }) => {
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
          className="object-cover w-full h-full rounded-sm"
          loading="lazy"
        />
      </AspectRatio>
      <HeartAnimation isAnimating={isAnimating} size="small" />
    </div>
  );
};

export default ImageCardMedia;