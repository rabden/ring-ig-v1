import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import ImageGallery from '@/components/ImageGallery';
import { Card } from '@/components/ui/card';
import { CalendarDays, Image, Heart } from 'lucide-react';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import FollowButton from '@/components/profile/FollowButton';
import FollowStats from '@/components/profile/FollowStats';
import { format, isValid, parseISO } from 'date-fns';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const PublicProfile = () => {
  const { userId } = useParams();
  const { session } = useSupabaseAuth();
  const currentUserId = session?.user?.id;

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

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      // Get total images
      const { count: totalImages } = await supabase
        .from('user_images')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_private', false);

      // Get total likes received
      const { count: totalLikes } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('created_by', userId);

      return {
        totalImages: totalImages || 0,
        totalLikes: totalLikes || 0
      };
    },
    enabled: !!userId
  });

  if (isProfileLoading || isStatsLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>User not found</div>;
  }

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMMM yyyy') : 'Unknown';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <ProfileAvatar user={{ user_metadata: { avatar_url: profile.avatar_url } }} size="lg" />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">{profile.display_name}</h1>
              {currentUserId && currentUserId !== userId && (
                <FollowButton userId={userId} />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Image className="w-4 h-4" />
                <span>{stats.totalImages} Images</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Heart className="w-4 h-4" />
                <span>{stats.totalLikes} Likes</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Joined {formatJoinDate(profile.created_at)}</span>
              </div>
            </div>

            <FollowStats userId={userId} />
          </div>
        </div>
      </Card>

      <ImageGallery 
        userId={userId}
        showPrivate={false}
        activeView="inspiration"
      />
    </div>
  );
};

export default PublicProfile;