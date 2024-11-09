import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import ImageGallery from '@/components/ImageGallery';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Image, Heart } from 'lucide-react';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import FollowButton from '@/components/profile/FollowButton';
import FollowStats from '@/components/profile/FollowStats';
import { format, isValid, parseISO } from 'date-fns';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Separator } from '@/components/ui/separator';

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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
      const { count: totalImages } = await supabase
        .from('user_images')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_private', false);

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
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-accent"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Avatar and follow button */}
          <div className="flex flex-col items-center gap-4">
            <ProfileAvatar 
              user={{ user_metadata: { avatar_url: profile.avatar_url } }} 
              size="lg" 
            />
            {currentUserId && currentUserId !== userId && (
              <FollowButton userId={userId} />
            )}
          </div>

          {/* Right column - User info */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.display_name}</h1>
              <p className="text-muted-foreground">Joined {formatJoinDate(profile.created_at)}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{stats.totalImages}</p>
                  <p className="text-sm text-muted-foreground">Images</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{stats.totalLikes}</p>
                  <p className="text-sm text-muted-foreground">Likes</p>
                </div>
              </div>
              <FollowStats userId={userId} />
            </div>
          </div>
        </div>
      </Card>

      <ImageGallery 
        userId={currentUserId}
        profileUserId={userId}
        activeView="myImages"
        nsfwEnabled={false}
        showPrivate={false}
      />
    </div>
  );
};

export default PublicProfile;