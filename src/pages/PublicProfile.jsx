import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import ImageGallery from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { format } from 'date-fns';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import { useFollows } from '@/hooks/useFollows';
import ProfileStats from '@/components/profile/ProfileStats';
import { Skeleton } from '@/components/ui/skeleton';

const PublicProfile = () => {
  const { userId } = useParams();
  const { session } = useSupabaseAuth();
  const { isFollowing, toggleFollow } = useFollows(userId);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const { data: stats = { totalImages: 0, totalLikes: 0 }, isLoading: isStatsLoading } = useQuery({
    queryKey: ['profileStats', userId],
    queryFn: async () => {
      const [imagesResult, likesResult] = await Promise.all([
        supabase
          .from('user_images')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
          .eq('is_private', false),
        supabase
          .from('user_image_likes')
          .select('*', { count: 'exact' })
          .eq('created_by', userId)
      ]);
      
      return {
        totalImages: imagesResult.count || 0,
        totalLikes: likesResult.count || 0
      };
    },
    enabled: !!userId
  });

  const { data: followCounts = { followers: 0, following: 0 }, isLoading: isFollowLoading } = useQuery({
    queryKey: ['followCounts', userId],
    queryFn: async () => {
      const [followersResult, followingResult] = await Promise.all([
        supabase
          .from('user_follows')
          .select('*', { count: 'exact' })
          .eq('following_id', userId),
        supabase
          .from('user_follows')
          .select('*', { count: 'exact' })
          .eq('follower_id', userId)
      ]);
      
      return {
        followers: followersResult.count || 0,
        following: followingResult.count || 0
      };
    },
    enabled: !!userId
  });

  if (isProfileLoading || isStatsLoading || isFollowLoading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <ProfileAvatar 
          user={{ user_metadata: { avatar_url: profile?.avatar_url } }} 
          size="lg" 
        />
        <h1 className="text-2xl font-bold">{profile?.display_name}</h1>
        <div className="text-sm text-muted-foreground">
          Joined {format(new Date(profile?.created_at), 'MMMM yyyy')}
        </div>
        
        {session?.user?.id !== userId && (
          <Button 
            variant={isFollowing ? "outline" : "default"}
            onClick={() => toggleFollow()}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}

        <ProfileStats 
          followersCount={followCounts.followers}
          followingCount={followCounts.following}
          totalLikes={stats.totalLikes}
          totalImages={stats.totalImages}
        />
      </div>

      <div className="mt-8">
        <ImageGallery 
          userId={userId}
          activeView="profile"
          showPrivate={false}
        />
      </div>
    </div>
  );
};

export default PublicProfile;