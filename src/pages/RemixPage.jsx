import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

const RemixPage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Fetch the image data
  const { data: image, isLoading, error } = useQuery({
    queryKey: ['remixImage', imageId],
    queryFn: async () => {
      if (!imageId) throw new Error('No image ID provided');

      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Image not found');
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load image');
      navigate('/');
      return;
    }

    if (!session) {
      toast.error('Please sign in to remix images');
      navigate('/');
      return;
    }

    if (image && !isLoading && modelConfigs) {
      try {
        // Handle model mapping and settings
        let targetModel = image.model;
        
        // Model mapping logic
        if (image.model === 'ultra' || image.model === 'pre-lar' || image.model === 'preLar') {
          targetModel = 'preLar';
        }

        // Get model config for the target model
        const modelConfig = modelConfigs[targetModel];
        if (!modelConfig) {
          console.error('Model not found:', targetModel);
          throw new Error('Model configuration not found');
        }

        // Create remix image with proper model settings
        const remixImage = {
          ...image,
          model: targetModel,
          // Handle quality settings based on model config
          quality: modelConfig.qualityLimits ? 
            (modelConfig.qualityLimits.includes(image.quality) ? image.quality : modelConfig.qualityLimits[0]) 
            : image.quality,
          // Ensure width and height are valid for the model
          width: image.width || 512,
          height: image.height || 512,
          // Keep original aspect ratio if it exists
          aspect_ratio: image.aspect_ratio || null
        };

        // Store the image data for the main page to use
        sessionStorage.setItem('pendingRemixImage', JSON.stringify(remixImage));

        // Navigate to main page with proper state
        navigate('/', { 
          state: { 
            shouldRemix: true,
            source: 'remix-page',
            isMobile
          } 
        });
      } catch (err) {
        console.error('Error preparing remix:', err);
        toast.error('Failed to prepare remix: ' + (err.message || 'Unknown error'));
        navigate('/');
      }
    }
  }, [image, isLoading, error, session, navigate, modelConfigs, isMobile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-[300px]">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  return null;
};

export default RemixPage; 