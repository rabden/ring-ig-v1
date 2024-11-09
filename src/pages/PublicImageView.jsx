import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { downloadImage } from '@/utils/downloadUtils';
import PublicDesktopView from '@/components/public-image/PublicDesktopView';
import PublicMobileView from '@/components/public-image/PublicMobileView';

const PublicImageView = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    await downloadImage(imageUrl, image.prompt);
  };

  const handleRemix = () => {
    navigate(`/remix/${image.id}`);
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
    <PublicMobileView
      image={image}
      modelConfigs={modelConfigs}
      styleConfigs={styleConfigs}
      onDownload={handleDownload}
      onRemix={handleRemix}
    />
  ) : (
    <PublicDesktopView
      image={image}
      modelConfigs={modelConfigs}
      styleConfigs={styleConfigs}
      onDownload={handleDownload}
      onRemix={handleRemix}
      onBack={() => navigate(-1)}
    />
  );
};

export default PublicImageView;