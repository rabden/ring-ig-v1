import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const useFollows = (userId) => {
  const queryClient = useQueryClient();

  const { data: isFollowing } = useQuery({
    queryKey: ['isFollowing', userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', supabase.auth.getUser()?.data?.user?.id)
        .eq('following_id', userId)
        .single();
      return !!data;
    },
    enabled: !!userId
  });

  const { mutate: toggleFollow } = useMutation({
    mutationFn: async () => {
      const currentUserId = supabase.auth.getUser()?.data?.user?.id;
      if (!currentUserId) throw new Error('Not authenticated');

      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', userId);
      } else {
        await supabase
          .from('user_follows')
          .insert({ follower_id: currentUserId, following_id: userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['isFollowing', userId]);
      queryClient.invalidateQueries(['user', userId]);
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    },
    onError: (error) => {
      toast.error('Failed to update follow status');
      console.error('Follow error:', error);
    }
  });

  return { isFollowing, toggleFollow };
};