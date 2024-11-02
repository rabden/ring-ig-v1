import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { Skeleton } from "@/components/ui/skeleton";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageViewHandlers } from './image-view/ImageViewHandlers';
import MobileImageView from './image-view/MobileImageView';
import DesktopImageView from './image-view/DesktopImageView';

const SingleImageView = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();

  const { data: image, isLoading } = useQuery({
    queryKey: ['singleImage', imageId],
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

  const handlers = useImageViewHandlers(image, session, navigate);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="md:block hidden">
        <DesktopImageView 
          image={image}
          session={session}
          modelConfigs={modelConfigs}
          styleConfigs={styleConfigs}
          handlers={handlers}
          onBack={() => navigate('/')}
        />
      </div>
      <div className="md:hidden block">
        <MobileImageView 
          image={image}
          session={session}
          modelConfigs={modelConfigs}
          styleConfigs={styleConfigs}
          handlers={handlers}
        />
      </div>
    </div>
  );
};

export default SingleImageView;