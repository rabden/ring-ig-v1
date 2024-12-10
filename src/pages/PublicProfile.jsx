import React, { useState } from 'react';
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
import FullScreenImageView from '@/components/FullScreenImageView';

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const currentUserId = session?.user?.id;
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, is_pro')
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

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMMM yyyy') : 'Unknown';
  };

  if (isProfileLoading || isStatsLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>User not found</div>;
  }

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <Button 
        variant="ghost" 
        className="mb-4 hover:bg-accent"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <ProfileAvatar 
              user={{ user_metadata: { avatar_url: profile.avatar_url } }} 
              size="lg" 
              isPro={profile.is_pro}
            />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold mb-1">{profile.display_name}</h1>
            <p className="text-sm text-muted-foreground mb-2">Joined {formatJoinDate(profile.created_at)}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 items-center">
              <div className="flex items-center gap-1">
                <Image className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{stats.totalImages}</span>
                <span className="text-xs text-muted-foreground ml-1">Images</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{stats.totalLikes}</span>
                <span className="text-xs text-muted-foreground ml-1">Likes</span>
              </div>
              <FollowStats userId={userId} />
              {currentUserId && currentUserId !== userId && (
                <FollowButton userId={userId} />
              )}
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
        onImageClick={handleImageClick}
      />

      {selectedImage && (
        <FullScreenImageView
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={() => {}}
          onDiscard={() => {}}
          onRemix={() => {}}
          isOwner={currentUserId === selectedImage.user_id}
        />
      )}
    </div>
  );
};

export default PublicProfile;