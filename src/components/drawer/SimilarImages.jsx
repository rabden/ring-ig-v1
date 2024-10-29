import React from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { Separator } from "@/components/ui/separator";

const SimilarImages = ({ similarImages, onImageClick, onOpenChange }) => {
  if (!similarImages?.length) return null;

  return (
    <>
      <Separator className="bg-border/50" />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Similar Images</h3>
        <div className="grid grid-cols-2 gap-2">
          {similarImages.map((similarImage) => (
            <div 
              key={similarImage.id} 
              className="relative rounded-lg overflow-hidden" 
              style={{ paddingTop: '100%' }}
            >
              <img
                src={supabase.storage.from('user-images').getPublicUrl(similarImage.storage_path).data.publicUrl}
                alt={similarImage.prompt}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                onClick={() => {
                  onOpenChange(false);
                  setTimeout(() => onImageClick(similarImage), 300);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SimilarImages;