import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

export const useFollows = (targetUserId) => {
  const { session } = useSupabaseAuth();
  const currentUserId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data: isFollowing = false } = useQuery({
    queryKey: ['isFollowing', currentUserId, targetUserId],
    queryFn: async () => {
      if (!currentUserId || !targetUserId) return false;
      
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId);
      
      if (error) {
        console.error('Error checking follow status:', error);
        return false;
      }
      
      return data.length > 0;
    },
    enabled: !!currentUserId && !!targetUserId
  });

  const { mutate: toggleFollow } = useMutation({
    mutationFn: async () => {
      if (!currentUserId || !targetUserId) {
        throw new Error('User must be logged in to follow others');
      }

      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);
      } else {
        await supabase
          .from('user_follows')
          .insert({ follower_id: currentUserId, following_id: targetUserId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['isFollowing', currentUserId, targetUserId]);
      queryClient.invalidateQueries(['user', targetUserId]);
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    },
    onError: (error) => {
      toast.error('Failed to update follow status');
      console.error('Follow error:', error);
    }
  });

  return { isFollowing, toggleFollow };
};