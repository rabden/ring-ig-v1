import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

const RemixPage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();

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

    if (image && !isLoading) {
      try {
        // Handle model mapping
        const remixImage = {
          ...image,
          // Map both 'ultra' and 'preLar' to 'preLar' to ensure consistency
          model: image.model === 'ultra' || image.model === 'preLar' ? 'preLar' : image.model
        };

        // Store the image data for the main page to use
        sessionStorage.setItem('pendingRemixImage', JSON.stringify(remixImage));

        // Navigate to main page with remix state
        navigate('/?view=myImages', { 
          state: { 
            shouldRemix: true,
            source: 'remix-page'
          } 
        });
      } catch (err) {
        console.error('Error preparing remix:', err);
        toast.error('Failed to prepare remix');
        navigate('/');
      }
    }
  }, [image, isLoading, error, session, navigate]);

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