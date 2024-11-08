import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FullScreenImageView from '@/components/FullScreenImageView';
import MobileImageDrawer from '@/components/MobileImageDrawer';
import { toast } from 'sonner';

const ImagePage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { data: image, isLoading, error } = useQuery({
    queryKey: ['singleImage', imageId],
    queryFn: async () => {
      if (!imageId) return null;
      
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .maybeSingle();

      if (error) {
        toast.error('Error loading image');
        throw error;
      }
      
      if (!data) {
        toast.error('Image not found');
        navigate('/');
        return null;
      }

      return data;
    },
    retry: false
  });

  const handlers = useImageHandlers({
    session,
    queryClient: null,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !image) {
    return null;
  }

  const isOwner = session?.user?.id === image?.user_id;

  return isMobile ? (
    <MobileImageDrawer
      open={true}
      onOpenChange={() => navigate(-1)}
      image={image}
      onDownload={() => handlers.handleDownload(image)}
      onDiscard={() => handlers.handleDiscard(image)}
      onRemix={() => handlers.handleRemix(image)}
      isOwner={isOwner}
      showFullImage={true}
    />
  ) : (
    <FullScreenImageView
      image={image}
      isOpen={true}
      onClose={() => navigate(-1)}
      onDownload={() => handlers.handleDownload(image)}
      onDiscard={() => handlers.handleDiscard(image)}
      onRemix={() => handlers.handleRemix(image)}
      isOwner={isOwner}
    />
  );
};

export default ImagePage;