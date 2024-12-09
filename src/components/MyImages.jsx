import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import DateGroupedGallery from './DateGroupedGallery';

const MyImages = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails,
  className 
}) => {
  const { data: userImages, isLoading } = useQuery({
    queryKey: ['userImages', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userImages?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h3 className="text-lg font-semibold mb-2">No Images Yet</h3>
        <p className="text-muted-foreground">
          Your generated images will appear here
        </p>
      </div>
    );
  }

  return (
    <DateGroupedGallery
      images={userImages}
      onImageClick={onImageClick}
      onDownload={onDownload}
      onDiscard={onDiscard}
      onRemix={onRemix}
      onViewDetails={onViewDetails}
      className={className}
    />
  );
};

export default MyImages;