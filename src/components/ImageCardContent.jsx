import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ImageCardContent = React.memo(({ 
  imageRef,
  imageLoaded,
  shouldLoad,
  imageSrc,
  image,
  onImageClick,
  onToggleLike,
  isLiked,
  modelName,
  styleName,
  isNsfw
}) => {
  return (
    <>
      <div ref={imageRef}>
        {(!imageLoaded || !shouldLoad) && (
          <div className="absolute inset-0 bg-muted animate-pulse">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        {shouldLoad && (
          <img 
            src={imageSrc}
            alt={image.prompt} 
            className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => onImageClick(image)}
            onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isLiked) onToggleLike(image.id); }}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        )}
      </div>
      <div className="absolute bottom-2 left-2 flex gap-1">
        <Badge variant="secondary" className="bg-black/50 text-white border-none text-[8px] md:text-[10px] py-0.5">
          {modelName}
        </Badge>
        {!isNsfw && (
          <Badge variant="secondary" className="bg-black/50 text-white border-none text-[8px] md:text-[10px] py-0.5">
            {styleName}
          </Badge>
        )}
      </div>
    </>
  );
});

ImageCardContent.displayName = 'ImageCardContent';

export default ImageCardContent;