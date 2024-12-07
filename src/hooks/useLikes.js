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
        await supabase
          .from('user_image_likes')
          .insert([{ user_id: userId, image_id: imageId }]);
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