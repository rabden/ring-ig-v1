import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import ImageGallery from '@/components/ImageGallery';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import UserPreferences from '@/components/profile/UserPreferences';
import { format } from 'date-fns';

const PublicProfile = () => {
  const { username } = useParams();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();

  const { data: profile } = useQuery({
    queryKey: ['publicProfile', username],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('display_name', username)
        .single();
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['userStats', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const [imagesCount, likesCount, createdAt] = await Promise.all([
        supabase.from('user_images').select('*', { count: 'exact' }).eq('user_id', profile.id),
        supabase.from('user_image_likes').select('*', { count: 'exact' }).eq('created_by', profile.id),
        supabase.from('profiles').select('created_at').eq('id', profile.id).single()
      ]);

      return {
        totalImages: imagesCount.count || 0,
        totalLikes: likesCount.count || 0,
        joinDate: createdAt.data?.created_at
      };
    },
    enabled: !!profile?.id
  });

  if (!profile) {
    return <div className="p-4">User not found</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <ProfileHeader profile={profile} stats={stats} />
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            <ProfileStats stats={stats} />
            <UserPreferences 
              userId={profile.id} 
              modelConfigs={modelConfigs} 
              styleConfigs={styleConfigs} 
            />
            <ImageGallery 
              userId={profile.id}
              showPrivate={false}
            />
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default PublicProfile;