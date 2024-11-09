import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { downloadImage } from '@/utils/downloadUtils';
import MobileImageDrawer from '@/components/MobileImageDrawer';
import FullScreenImageView from '@/components/FullScreenImageView';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageRemix } from '@/hooks/useImageRemix';

const PublicImageView = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { handleRemix } = useImageRemix(session);

  const { data: image, isLoading } = useQuery({
    queryKey: ['publicImage', imageId],
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
    <MobileImageDrawer
      open={true}
      onOpenChange={() => navigate(-1)}
      image={image}
      showFullImage={true}
      onDownload={handleDownload}
      onRemix={handleRemix}
      isOwner={image.user_id === session?.user?.id}
      setActiveTab={() => {}}
      setStyle={() => {}}
    />
  ) : (
    <FullScreenImageView
      image={image}
      isOpen={true}
      onClose={() => navigate(-1)}
      onDownload={handleDownload}
      onDiscard={() => {}}
      onRemix={handleRemix}
      isOwner={image.user_id === session?.user?.id}
      setStyle={() => {}}
      setActiveTab={() => {}}
    />
  );
};

export default PublicImageView;