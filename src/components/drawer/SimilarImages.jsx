import React from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { Separator } from "@/components/ui/separator";
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 2,
  640: 2
};

const SimilarImages = ({ similarImages, onImageClick }) => {
  if (!similarImages?.length) return null;

  return (
    <>
      <Separator className="bg-border/50" />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Similar Images</h3>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-2 w-auto"
          columnClassName="pl-2 bg-clip-padding"
        >
          {similarImages.map((similarImage) => (
            <div key={similarImage.id} className="mb-2">
              <div 
                className="relative rounded-lg overflow-hidden" 
                style={{ paddingTop: `${(similarImage.height / similarImage.width) * 100}%` }}
              >
                <img
                  src={supabase.storage.from('user-images').getPublicUrl(similarImage.storage_path).data.publicUrl}
                  alt={similarImage.prompt}
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  onClick={() => onImageClick(similarImage)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {similarImage.prompt}
              </p>
            </div>
          ))}
        </Masonry>
      </div>
    </>
  );
};

export default SimilarImages;