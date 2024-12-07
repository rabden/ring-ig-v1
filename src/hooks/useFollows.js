import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

export const useFollows = (targetUserId) => {
  const { session } = useSupabaseAuth();
  const currentUserId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data: followData } = useQuery({
    queryKey: ['follows', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return { isFollowing: false, following: [] };
      
      const { data: followingData } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', currentUserId);
        
      const following = followingData?.map(f => f.following_id) || [];
      const isFollowing = targetUserId ? following.includes(targetUserId) : false;
      
      return { isFollowing, following };
    },
    enabled: !!currentUserId
  });

  const { mutate: toggleFollow } = useMutation({
    mutationFn: async () => {
      if (!currentUserId || !targetUserId) {
        throw new Error('User must be logged in to follow others');
      }

      if (currentUserId === targetUserId) {
        throw new Error('Users cannot follow themselves');
      }

      const isCurrentlyFollowing = followData?.isFollowing;

      // Get current user's profile for notification
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', currentUserId)
        .single();

      if (isCurrentlyFollowing) {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);

        if (error) throw error;
      } else {
        // Insert follow with created_at
        const { error } = await supabase
          .from('user_follows')
          .insert({ 
            follower_id: currentUserId, 
            following_id: targetUserId,
            created_at: new Date().toISOString()
          });

        if (error) throw error;

        // Create notification for the followed user
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert([{
            user_id: targetUserId,
            type: 'follow',
            title: 'New Follower',
            message: `${currentUserProfile?.display_name || 'Someone'} started following you`,
            image_url: currentUserProfile?.avatar_url || '',
            link: `/profile/${currentUserId}`,
            actor_id: currentUserId,
            target_id: targetUserId,
            is_read: false,
            created_at: new Date().toISOString()
          }]);
        
        if (notificationError) {
          console.error('Notification error:', notificationError);
          throw notificationError;
        }
      }

      // The follow counts will be updated automatically by the on_follow_changed trigger
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['follows', currentUserId]);
      queryClient.invalidateQueries(['user', targetUserId]);
      queryClient.invalidateQueries(['user', currentUserId]);
      queryClient.invalidateQueries(['profile', targetUserId]);
      queryClient.invalidateQueries(['profile', currentUserId]);
      
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
    toggleFollow 
  };
};