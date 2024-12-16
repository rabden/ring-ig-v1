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
import { cn } from "@/lib/utils";

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
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground/70">User not found</p>
        <Button variant="ghost" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-6">
      <Button 
        variant="ghost" 
        className={cn(
          "hover:bg-accent/10",
          "text-muted-foreground/70 hover:text-foreground/80"
        )}
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className={cn(
        "p-6 sm:p-8",
        "border border-border/20 bg-card/40",
        "backdrop-blur-sm shadow-[0_0_0_1px] shadow-border/10"
      )}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <ProfileAvatar 
              user={{ user_metadata: { avatar_url: profile.avatar_url } }} 
              size="lg" 
              isPro={profile.is_pro}
            />
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground/90 mb-1">
                {profile.display_name}
              </h1>
              <p className="text-sm text-muted-foreground/70">
                Joined {formatJoinDate(profile.created_at)}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-5 items-center">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                "bg-accent/5 border border-border/10"
              )}>
                <Image className="w-4 h-4 text-muted-foreground/70" />
                <span className="text-sm font-medium text-foreground/80">{stats.totalImages}</span>
                <span className="text-xs text-muted-foreground/70">Images</span>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                "bg-accent/5 border border-border/10"
              )}>
                <Heart className="w-4 h-4 text-muted-foreground/70" />
                <span className="text-sm font-medium text-foreground/80">{stats.totalLikes}</span>
                <span className="text-xs text-muted-foreground/70">Likes</span>
              </div>
              <FollowStats userId={userId} />
              {currentUserId && currentUserId !== userId && (
                <FollowButton userId={userId} />
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="pt-2">
        <ImageGallery 
          userId={currentUserId}
          profileUserId={userId}
          activeView="myImages"
          nsfwEnabled={false}
          showPrivate={false}
          onImageClick={handleImageClick}
        />
      </div>

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