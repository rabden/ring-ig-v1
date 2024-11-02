import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/supabase';

const ImageGallery = ({ images, onImageClick }) => {
  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="grid grid-cols-1 gap-4 pr-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer"
            onClick={() => onImageClick(image)}
          >
            <img
              src={supabase.storage.from("user-images").getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ImageGallery;