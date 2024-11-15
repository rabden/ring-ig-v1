import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLikes = (userId) => {
  const { data: likesData = { userLikes: [], totalLikes: 0 }, isLoading } = useQuery({
    queryKey: ['likes', userId],
    queryFn: async () => {
      if (!userId) return { userLikes: [], totalLikes: 0 };

      // Get images this user has liked
      const { data: userLikes, error: likesError } = await supabase
        .from('user_image_likes')
        .select('image_id')
        .eq('user_id', userId);

      if (likesError) {
        console.error('Error fetching user likes:', likesError);
        return { userLikes: [], totalLikes: 0 };
      }

      // Get total likes received on user's images
      const { data: totalLikesReceived, error: totalLikesError } = await supabase
        .from('user_image_likes')
        .select('id')
        .eq('created_by', userId);

      if (totalLikesError) {
        console.error('Error fetching total likes:', totalLikesError);
        return { userLikes: userLikes || [], totalLikes: 0 };
      }

      return {
        userLikes: userLikes?.map(like => like.image_id) || [],
        totalLikes: totalLikesReceived?.length || 0
      };
    },
    enabled: !!userId,
    refetchInterval: 5000
  });

  return {
    userLikes: likesData.userLikes,
    totalLikes: likesData.totalLikes,
    isLoading
  };
};