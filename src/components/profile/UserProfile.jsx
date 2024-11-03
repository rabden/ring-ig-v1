import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { Badge } from "@/components/ui/badge";
import { UserCircle2 } from "lucide-react";
import ImageGallery from '../ImageGallery';
import { toast } from 'sonner';
import { downloadImage } from '@/utils/downloadUtils';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: isPro } = useProUser(userId);
  const { session } = useSupabaseAuth();
  const isOwnProfile = session?.user?.id === userId;

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

  const { data: totalLikes = 0 } = useQuery({
    queryKey: ['totalLikes', userId],
    queryFn: async () => {
      const { data: userImages, error: imagesError } = await supabase
        .from('user_images')
        .select('id')
        .eq('user_id', userId);

      if (imagesError) throw imagesError;

      if (!userImages.length) return 0;

      const imageIds = userImages.map(img => img.id);

      const { count, error: likesError } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .in('image_id', imageIds);

      if (likesError) throw likesError;
      return count || 0;
    },
  });

  const handleImageClick = (image) => {
    navigate(`/image/${image.id}`);
  };

  const handleDownload = async (imageUrl, prompt) => {
    try {
      await downloadImage(imageUrl, prompt);
      toast.success('Image downloaded successfully');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleDiscard = async (image) => {
    if (!isOwnProfile) return; // Only allow discard on own profile
    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', image.id);
      
      if (error) throw error;
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleRemix = (image) => {
    navigate(`/remix/${image.id}`);
  };

  const handleViewDetails = (image) => {
    navigate(`/image/${image.id}`);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className={`relative ${isPro ? 'p-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 rounded-full' : ''}`}>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className={`w-24 h-24 rounded-full ${isPro ? 'border-2 border-background' : ''}`}
            />
          ) : (
            <UserCircle2 className="w-24 h-24 text-muted-foreground" />
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <h1 className="text-2xl font-bold">{profile.display_name}</h1>
          {isPro && (
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 text-background">
              PRO
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-2">
          {totalLikes} total likes
        </p>
      </div>

      <ImageGallery
        userId={userId}
        activeView="myImages"
        onImageClick={handleImageClick}
        onDownload={handleDownload}
        onDiscard={isOwnProfile ? handleDiscard : null} // Only pass discard handler if it's the user's own profile
        onRemix={handleRemix}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default UserProfile;