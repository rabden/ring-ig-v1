import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import ImageGallery from '../ImageGallery';

const RelatedImages = ({ image, userId }) => {
  const { data: creatorImages } = useQuery({
    queryKey: ['creatorImages', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_images')
        .select('*')
        .eq('user_id', userId)
        .neq('id', image.id)
        .limit(8);
      return data;
    },
    enabled: !!userId
  });

  const { data: similarImages } = useQuery({
    queryKey: ['similarImages', image.style, image.model],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_images')
        .select('*')
        .eq('style', image.style)
        .eq('model', image.model)
        .neq('id', image.id)
        .limit(8);
      return data;
    },
    enabled: !!(image.style && image.model)
  });

  return (
    <div className="space-y-6">
      {creatorImages?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">More from this creator</h3>
          <ImageGallery images={creatorImages} />
        </div>
      )}
      {similarImages?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Similar images</h3>
          <ImageGallery images={similarImages} />
        </div>
      )}
    </div>
  );
};

export default RelatedImages;