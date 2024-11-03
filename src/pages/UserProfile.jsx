import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useProUser } from '@/hooks/useProUser';
import ImageGallery from '@/components/ImageGallery';
import ProfileAvatar from '@/components/profile/ProfileAvatar';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  
  const { data: profile } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('display_name', username)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: isPro } = useProUser(profile?.id);

  const { data: totalLikes = 0 } = useQuery({
    queryKey: ['totalLikes', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0;
      const { count, error } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('created_by', profile.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!profile?.id
  });

  if (!profile) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="text-center">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col items-center space-y-4 mb-8">
          <ProfileAvatar 
            user={{ user_metadata: { avatar_url: profile.avatar_url } }}
            isPro={isPro}
            size="lg"
          />
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">{profile.display_name}</h1>
            {isPro && (
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 text-primary-foreground">
                Pro User
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {totalLikes} Total Likes
            </p>
          </div>
        </div>

        <ImageGallery
          userId={session?.user?.id}
          onImageClick={(image) => navigate(`/image/${image.id}`)}
          onDownload={() => {}}
          onDiscard={() => {}}
          onRemix={(image) => navigate(`/remix/${image.id}`)}
          onViewDetails={(image) => navigate(`/image/${image.id}`)}
          activeView="myImages"
          activeFilters={{ userId: profile.id }}
          nsfwEnabled={true}
        />
      </div>
    </div>
  );
};

export default UserProfile;