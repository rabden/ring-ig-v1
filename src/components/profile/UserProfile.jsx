import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { Badge } from "@/components/ui/badge";
import { UserCircle2 } from "lucide-react";
import ImageGallery from '../ImageGallery';

const UserProfile = () => {
  const { userId } = useParams();
  const { data: isPro } = useProUser(userId);

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
      />
    </div>
  );
};

export default UserProfile;