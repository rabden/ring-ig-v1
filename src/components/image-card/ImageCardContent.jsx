import React from 'react';
import { Badge } from "@/components/ui/badge";
import ImageStatusIndicators from '../ImageStatusIndicators';
import HeartAnimation from '../animations/HeartAnimation';

const ImageCardContent = ({ 
  image, 
  imageUrl, 
  isLoading, 
  handleImageLoad, 
  handleImageClick, 
  handleDoubleClick, 
  isAnimating,
  modelName,
  styleName,
  isNsfw 
}) => {
  return (
    <div className="relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
      <ImageStatusIndicators 
        isTrending={image.is_trending} 
        isHot={image.is_hot} 
      />
      <div className="absolute inset-0">
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <img 
          src={imageUrl}
          alt={image.prompt} 
          className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleImageClick}
          onDoubleClick={handleDoubleClick}
          onLoad={handleImageLoad}
          loading="lazy"
          decoding="async"
        />
        <HeartAnimation isAnimating={isAnimating} />
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
    </div>
  );
};

export default ImageCardContent;