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
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Separator } from '@/components/ui/separator';
import FullScreenImageView from '@/components/FullScreenImageView';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const StatItem = ({ icon: Icon, value, label }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-1.5 group"
  >
    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
    <span className="text-sm font-medium group-hover:text-primary transition-colors duration-300">{value}</span>
    <span className="text-xs text-muted-foreground ml-0.5">{label}</span>
  </motion.div>
);

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-8 w-[100px]" />
      <Skeleton className="h-8 w-[100px]" />
      <Skeleton className="h-8 w-[100px]" />
    </div>
  </div>
);

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

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  if (isProfileLoading || isStatsLoading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 text-center"
      >
        <h2 className="text-2xl font-semibold text-foreground/80">User not found</h2>
        <p className="text-muted-foreground mt-2">The profile you're looking for doesn't exist.</p>
        <Button 
          variant="default" 
          className="mt-4"
          onClick={() => navigate('/')}
        >
          Return Home
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-4 sm:py-8"
    >
      <Button 
        variant="ghost" 
        className="mb-4 hover:bg-accent group"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2 group-hover:text-primary transition-colors duration-300" />
        <span className="group-hover:text-primary transition-colors duration-300">Back</span>
      </Button>

      <Card className="p-4 sm:p-6 mb-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-4 relative"
        >
          <div className="flex-shrink-0">
            <ProfileAvatar 
              user={{ user_metadata: { avatar_url: profile.avatar_url } }} 
              size="lg" 
              isPro={profile.is_pro}
            />
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {profile.display_name}
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center sm:justify-start gap-4 items-center"
            >
              <StatItem icon={Image} value={stats.totalImages} label="Images" />
              <StatItem icon={Heart} value={stats.totalLikes} label="Likes" />
              <FollowStats userId={userId} />
              {currentUserId && currentUserId !== userId && (
                <FollowButton userId={userId} />
              )}
            </motion.div>
          </div>
        </motion.div>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ImageGallery 
          userId={currentUserId}
          profileUserId={userId}
          activeView="myImages"
          nsfwEnabled={false}
          showPrivate={false}
          onImageClick={handleImageClick}
        />
      </motion.div>

      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  );
};

export default PublicProfile;