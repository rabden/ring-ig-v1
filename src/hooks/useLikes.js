import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLikes = (userId) => {
  const queryClient = useQueryClient();
  const [isLiking, setIsLiking] = useState(false);

  const { data: userLikes } = useQuery({
    queryKey: ['userLikes', userId],
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

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('user_image_likes_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_image_likes',
      }, (payload) => {
        // Update the likes count for the affected image
        queryClient.invalidateQueries(['imageLikes', payload.new?.image_id || payload.old?.image_id]);
        
        // Update the user's likes list
        queryClient.invalidateQueries(['userLikes', userId]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const toggleLike = async (imageId) => {
    if (!userId || isLiking) return;
    setIsLiking(true);

    try {
      const isLiked = userLikes?.includes(imageId);

      if (isLiked) {
        await supabase
          .from('user_image_likes')
          .delete()
          .eq('user_id', userId)
          .eq('image_id', imageId);
      } else {
        // Get the image details first
        const { data: imageData, error: imageError } = await supabase
          .from('user_images')
          .select('*')
          .eq('id', imageId)
          .single();

        if (imageError) throw imageError;

        // Get current user's profile
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', userId)
          .single();

        if (userError) throw userError;

        // Insert the like with created_by field
        await supabase
          .from('user_image_likes')
          .insert([{ 
            user_id: imageData.user_id, 
            image_id: imageId,
            created_by: userId,
            created_at: new Date().toISOString()
          }]);

        // Create notification for the image owner
        if (imageData.user_id !== userId) {  // Don't notify if user likes their own image
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert([{
              user_id: imageData.user_id,
              type: 'like',
              title: 'New Like',
              message: `${userProfile?.display_name || 'Someone'} liked your image`,
              image_url: supabase.storage.from('user-images').getPublicUrl(imageData.storage_path).data.publicUrl,
              link: `/image/${imageId}`,
              actor_id: userId,
              target_id: imageId,
              is_read: false,
              created_at: new Date().toISOString()
            }]);

          if (notificationError) {
            console.error('Notification error:', notificationError);
            throw notificationError;
          }
        }
      }

      // Optimistically update the UI
      queryClient.setQueryData(['userLikes', userId], (old = []) => {
        if (isLiked) {
          return old.filter(id => id !== imageId);
        } else {
          return [...old, imageId];
        }
      });

      // Optimistically update the like count
      queryClient.setQueryData(['imageLikes', imageId], (old = 0) => {
        return isLiked ? old - 1 : old + 1;
      });

    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  return {
    userLikes: userLikes || [],
    toggleLike,
    isLiking
  };
};