import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const useFollows = (userId) => {
  const queryClient = useQueryClient();

  const { data: followData = { isFollowing: false, following: [] } } = useQuery({
    queryKey: ['follows', userId],
    queryFn: async () => {
      if (!userId) {
        return { isFollowing: false, following: [] };
      }
      
      const { data: followingData, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', userId);
        
      if (error) {
        console.error('Error fetching follows:', error);
        return { isFollowing: false, following: [] };
      }

      const following = followingData?.map(f => f.following_id) || [];
      const isFollowing = userId ? following.includes(userId) : false;
      
      return { isFollowing, following };
    },
    enabled: true
  });

  const toggleFollow = useMutation({
    mutationFn: async (targetUserId) => {
      if (!userId) {
        throw new Error('User must be logged in to follow others');
      }

      if (userId === targetUserId) {
        throw new Error('Users cannot follow themselves');
      }

      const isCurrentlyFollowing = followData?.following?.includes(targetUserId);

      if (isCurrentlyFollowing) {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', userId)
          .eq('following_id', targetUserId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_follows')
          .insert({ 
            follower_id: userId, 
            following_id: targetUserId 
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['follows', userId]);
      queryClient.invalidateQueries(['followCounts']);
      toast.success(followData?.isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    },
    onError: (error) => {
      toast.error('Failed to update follow status');
      console.error('Follow error:', error);
    }
  });

  return { 
    isFollowing: followData?.isFollowing || false, 
    following: followData?.following || [],
    toggleFollow: toggleFollow.mutate 
  };
};