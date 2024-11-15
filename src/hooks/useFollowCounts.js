import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useFollowCounts = (userId) => {
  const { data: counts = { followersCount: 0, followingCount: 0 }, isLoading } = useQuery({
    queryKey: ['followCounts', userId],
    queryFn: async () => {
      if (!userId) {
        return { followersCount: 0, followingCount: 0 };
      }

      // Get followers (people who follow this user - where this user is the following_id)
      const { count: followersCount, error: followersError } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      if (followersError) {
        console.error('Error fetching followers:', followersError);
        return { followersCount: 0, followingCount: 0 };
      }

      // Get following (people this user follows - where this user is the follower_id)
      const { count: followingCount, error: followingError } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      if (followingError) {
        console.error('Error fetching following:', followingError);
        return { followersCount: 0, followingCount: 0 };
      }

      return {
        followersCount: followersCount || 0,
        followingCount: followingCount || 0
      };
    },
    enabled: !!userId,
    refetchInterval: 5000
  });

  return {
    followersCount: counts.followersCount,
    followingCount: counts.followingCount,
    isLoading
  };
};