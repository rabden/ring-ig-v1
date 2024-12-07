import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useLikes = (userId) => {
  const queryClient = useQueryClient();

  const { data: userLikes } = useQuery({
    queryKey: ['likes', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        const { data, error } = await supabase
          .from('user_image_likes')
          .select('image_id')
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error fetching likes:', error);
          return [];
        }
        
        return data?.map(like => like.image_id) || [];
      } catch (err) {
        console.error('Failed to fetch likes:', err);
        return [];
      }
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const toggleLike = useMutation({
    mutationFn: async (imageId) => {
      if (!userId) return;
      
      const isLiked = userLikes?.includes(imageId);
      
      try {
        if (isLiked) {
          const { error } = await supabase
            .from('user_image_likes')
            .delete()
            .eq('user_id', userId)
            .eq('image_id', imageId);
            
          if (error) throw error;
        } else {
          // First check if the like already exists
          const { data: existingLike } = await supabase
            .from('user_image_likes')
            .select('id')
            .eq('user_id', userId)
            .eq('image_id', imageId)
            .maybeSingle();

          // Only proceed with insert if like doesn't exist
          if (!existingLike) {
            // Get the image details
            const { data: imageData, error: imageError } = await supabase
              .from('user_images')
              .select('*')
              .eq('id', imageId)
              .single();
            
            if (imageError) throw imageError;

            // Get current user's profile
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('id', userId)
              .single();

            // Insert the like
            const { error } = await supabase
              .from('user_image_likes')
              .insert([{ 
                user_id: userId, 
                image_id: imageId,
                created_by: imageData.user_id 
              }]);
              
            // Ignore duplicate key errors (23505)
            if (error && error.code !== '23505') throw error;

            // Create notification only if insert was successful
            if (!error) {
              const { error: notificationError } = await supabase
                .from('notifications')
                .insert([{
                  user_id: imageData.user_id,
                  title: 'New Like',
                  message: `${userProfile?.display_name || 'Someone'} liked your image`,
                  image_url: supabase.storage.from('user-images').getPublicUrl(imageData.storage_path).data.publicUrl,
                  link: `/image/${imageId}`
                }]);
              
              if (notificationError) console.error('Failed to create notification:', notificationError);
            }
          }
        }
      } catch (err) {
        console.error('Error toggling like:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['likes', userId]);
    },
    onError: (error) => {
      console.error('Failed to toggle like:', error);
    }
  });

  return {
    userLikes: userLikes || [],
    toggleLike: toggleLike.mutate
  };
};