import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useEffect } from 'react';

export const useLikes = (userId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('likes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_image_likes' },
        (payload) => {
          queryClient.invalidateQueries(['likes', userId]);
          queryClient.invalidateQueries(['imageLikes']);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const { data: userLikes } = useQuery({
    queryKey: ['likes', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_image_likes')
        .select('image_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data.map(like => like.image_id);
    },
    enabled: !!userId
  });

  const toggleLike = useMutation({
    mutationFn: async (imageId) => {
      const isLiked = userLikes?.includes(imageId);
      
      if (isLiked) {
        const { error } = await supabase
          .from('user_image_likes')
          .delete()
          .eq('user_id', userId)
          .eq('image_id', imageId);
        if (error) throw error;
      } else {
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
        if (error) throw error;

        // Create notification for the image owner
        if (imageData.user_id !== userId) {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert([{
              user_id: imageData.user_id,
              title: 'New Like',
              message: `${userProfile?.display_name || 'Someone'} liked your image`,
              image_url: supabase.storage.from('user-images').getPublicUrl(imageData.storage_path).data.publicUrl,
              link: `/image/${imageId}`
            }]);
          
          if (notificationError) throw notificationError;
        }
      }
    },
    onMutate: async (imageId) => {
      // Optimistically update the UI
      const previousLikes = queryClient.getQueryData(['likes', userId]);
      queryClient.setQueryData(['likes', userId], old => {
        const isLiked = old?.includes(imageId);
        if (isLiked) {
          return old.filter(id => id !== imageId);
        } else {
          return [...(old || []), imageId];
        }
      });
      return { previousLikes };
    },
    onError: (err, imageId, context) => {
      // Revert optimistic update on error
      queryClient.setQueryData(['likes', userId], context.previousLikes);
    }
  });

  return {
    userLikes: userLikes || [],
    toggleLike: toggleLike.mutate
  };
};