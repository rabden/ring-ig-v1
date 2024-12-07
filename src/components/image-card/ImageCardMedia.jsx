import React from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import HeartAnimation from '@/components/animations/HeartAnimation';

const ImageCardMedia = ({ image, onImageClick, onDoubleClick, isAnimating }) => {
  return (
    <div className="relative group cursor-pointer" onClick={onImageClick} onDoubleClick={onDoubleClick}>
      <AspectRatio ratio={image.width / image.height}>
        <img
          src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
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