import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';

const RemixPage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();

  // Fetch the image data
  const { data: image, isLoading } = useQuery({
    queryKey: ['remixImage', imageId],
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

  useEffect(() => {
    if (!session) {
      toast.error('Please sign in to remix images');
      navigate('/');
      return;
    }

    if (image) {
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
    }
  }, [image, session, navigate]);

  // Show nothing while processing
  return null;
};

export default RemixPage; 