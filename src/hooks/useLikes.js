import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useLikes = (userId) => {
  const queryClient = useQueryClient();

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
        // Get the created_by value from the user_images table
        const { data: imageData, error: imageError } = await supabase
          .from('user_images')
          .select('user_id')
          .eq('id', imageId)
          .single();
        
        if (imageError) throw imageError;

        const { error } = await supabase
          .from('user_image_likes')
          .insert([{ 
            user_id: userId, 
            image_id: imageId,
            created_by: imageData.user_id 
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['likes', userId]);
    }
  });

  return {
    userLikes: userLikes || [],
    toggleLike: toggleLike.mutate
  };
};