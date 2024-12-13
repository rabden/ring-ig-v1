import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Skeleton } from "@/components/ui/skeleton";
import FullScreenImageView from '@/components/FullScreenImageView';
import SharedMobileImageView from '@/components/shared-image/SharedMobileImageView';
import { downloadImage } from '@/utils/downloadUtils';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageRemix } from '@/hooks/useImageRemix';

const SharedImageView = () => {
  const { imageId } = useParams();
  const { session } = useSupabaseAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { handleRemix } = useImageRemix(session);

  const { data: image, isLoading } = useQuery({
    queryKey: ['sharedImage', imageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async () => {
    if (!image) return;
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    await downloadImage(imageUrl, image.prompt);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="w-full h-[60vh]" />
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="text-center">Image not found</div>
      </div>
    );
  }

  return isMobile ? (
    <SharedMobileImageView
      image={image}
      onDownload={handleDownload}
      onRemix={handleRemix}
      session={session}
    />
  ) : (
    <FullScreenImageView
      image={image}
      isOpen={true}
      onClose={() => {}}
      onDownload={handleDownload}
      onRemix={handleRemix}
      isOwner={image.user_id === session?.user?.id}
      setStyle={() => {}}
      setActiveTab={() => {}}
    />
  );
};

export default SharedImageView;