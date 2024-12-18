import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';
import { Skeleton } from "@/components/ui/skeleton";

const ImageCardMedia = ({ image, onImageClick, onDoubleClick, isAnimating }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const imageUrl = supabase.storage
    .from('user-images')
    .getPublicUrl(image.storage_path)
    .data.publicUrl;

  return (
    <div 
      className={cn(
        "relative aspect-square cursor-pointer overflow-hidden",
        "group/media transition-all duration-200"
      )}
      onClick={onImageClick}
      onDoubleClick={onDoubleClick}
    >
      {isLoading && (
        <div className={cn(
          "absolute inset-0",
          "bg-black/30 backdrop-blur-sm",
          "animate-pulse"
        )}>
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={image.prompt}
        className={cn(
          "w-full h-full object-cover",
          "transition-all duration-300",
          "group-hover/media:scale-105",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
      
      {/* Hover overlay */}
      <div className={cn(
        "absolute inset-0 bg-black/0",
        "transition-all duration-200",
        "group-hover/media:bg-black/20"
      )} />

      {/* Like animation */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className={cn(
            "w-24 h-24 text-white",
            "animate-like-pulse",
            "opacity-0"
          )} />
        </div>
      )}
    </div>
  );
};

export default ImageCardMedia;