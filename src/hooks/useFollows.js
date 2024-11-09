import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const useFollows = (userId) => {
  const queryClient = useQueryClient();

  // Get followers
  const { data: followers = [] } = useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_follows')
        .select('follower_id, profiles!user_follows_follower_id_fkey(display_name, avatar_url)')
        .eq('following_id', userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Get following
  const { data: following = [] } = useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id, profiles!user_follows_following_id_fkey(display_name, avatar_url)')
        .eq('follower_id', userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Check if following a specific user
  const isFollowing = (targetUserId) => {
    return following.some(f => f.following_id === targetUserId);
  };

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: async (targetUserId) => {
      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: userId, following_id: targetUserId });
      
      if (error) throw error;
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries(['followers', targetUserId]);
      queryClient.invalidateQueries(['following', userId]);
      toast.success('Successfully followed user');
    },
    onError: () => {
      toast.error('Failed to follow user');
    }
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: async (targetUserId) => {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', targetUserId);
      
      if (error) throw error;
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries(['followers', targetUserId]);
      queryClient.invalidateQueries(['following', userId]);
      toast.success('Successfully unfollowed user');
    },
    onError: () => {
      toast.error('Failed to unfollow user');
    }
  });

  const toggleFollow = async (targetUserId) => {
    if (isFollowing(targetUserId)) {
      await unfollowMutation.mutateAsync(targetUserId);
    } else {
      await followMutation.mutateAsync(targetUserId);
    }
  };

  return {
    followers,
    following,
    isFollowing,
    toggleFollow,
    isLoading: followMutation.isPending || unfollowMutation.isPending
  };
};