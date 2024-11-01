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
          .select('full_name, avatar_url')
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
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert([{
            user_id: imageData.user_id,
            title: 'New Like',
            message: `${userProfile?.full_name || 'Someone'} liked your image`,
            image_url: supabase.storage.from('user-images').getPublicUrl(imageData.storage_path).data.publicUrl,
            link: `/image/${imageId}`
          }]);
        
        if (notificationError) throw notificationError;
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