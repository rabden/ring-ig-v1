import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { format } from 'date-fns';
import ImageGallery from '@/components/ImageGallery';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { useFollows } from '@/hooks/useFollows';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import { useImageHandlers } from '@/hooks/useImageHandlers';

const PublicProfile = () => {
  const { userId } = useParams();
  const { session } = useSupabaseAuth();
  const { isFollowing, toggleFollow } = useFollows(userId);
  const imageHandlers = useImageHandlers();

  const { data: profile } = useQuery({
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
  });

  const { data: stats } = useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      const [imagesResponse, likesResponse, followersResponse, followingResponse] = await Promise.all([
        supabase.from('user_images').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_image_likes').select('id', { count: 'exact' }).eq('image_id', userId),
        supabase.from('user_follows').select('id', { count: 'exact' }).eq('following_id', userId),
        supabase.from('user_follows').select('id', { count: 'exact' }).eq('follower_id', userId),
      ]);

      return {
        totalImages: imagesResponse.count || 0,
        totalLikes: likesResponse.count || 0,
        followers: followersResponse.count || 0,
        following: followingResponse.count || 0,
      };
    },
  });

  if (!profile) return null;

  const joinDate = format(new Date(profile.created_at), 'MMMM yyyy');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <ProfileAvatar user={profile} size="lg" />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{profile.display_name}</h1>
              {session?.user?.id !== userId && (
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  onClick={() => toggleFollow()}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold">{stats?.totalImages || 0}</p>
                <p className="text-sm text-muted-foreground">Images</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalLikes || 0}</p>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.followers || 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.following || 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Joined {joinDate}
            </p>
          </div>
        </div>

        <ImageGallery
          userId={userId}
          activeView="inspiration"
          nsfwEnabled={false}
          showPrivate={false}
          {...imageHandlers}
        />
      </div>
    </div>
  );
};

export default PublicProfile;