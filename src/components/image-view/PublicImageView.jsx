import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'sonner';
import { downloadImage } from '@/utils/downloadUtils';
import FullScreenImageView from '../FullScreenImageView';
import MobileImageDrawer from '../MobileImageDrawer';

const PublicImageView = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);

  const { data: image, isLoading, error } = useQuery({
    queryKey: ['publicImage', imageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error('Image not found');
        navigate('/');
        return null;
      }
      return data;
    },
  });

  const handleDownload = async () => {
    if (!image) return;
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    await downloadImage(imageUrl, image.prompt);
  };

  const handleRemix = () => {
    navigate(`/remix/${image.id}`);
  };

  if (isLoading || !image) return null;
  if (error) {
    toast.error('Failed to load image');
    navigate('/');
    return null;
  }

  return isMobile ? (
    <MobileImageDrawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      image={image}
      onDownload={handleDownload}
      onRemix={handleRemix}
      isOwner={false}
      showFullImage={true}
      hideUserInfo={true}
    />
  ) : (
    <FullScreenImageView
      image={image}
      isOpen={true}
      onClose={() => navigate('/')}
      onDownload={handleDownload}
      onRemix={handleRemix}
      isOwner={false}
      hideUserInfo={true}
    />
  );
};

export default PublicImageView;