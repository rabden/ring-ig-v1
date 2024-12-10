import React, { useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { toast } from "sonner";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { handleAvatarUpload } from '@/utils/profileUtils';
import ProfileHeaderSection from '@/components/profile/ProfileHeaderSection';
import ProfileImageSection from '@/components/profile/ProfileImageSection';
import CreditsSection from '@/components/profile/CreditsSection';
import StatsSection from '@/components/profile/StatsSection';

const UserProfile = () => {
  const { session, loading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showFullImage, setShowFullImage] = useState(false);
  const { data: isPro } = useProUser(session?.user?.id);

  const { data: userStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['userStats', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const [followersResult, followingResult, likesResult, profileResult] = await Promise.all([
          supabase
            .from('user_follows')
            .select('*', { count: 'exact' })
            .eq('following_id', session.user.id),
          supabase
            .from('user_follows')
            .select('*', { count: 'exact' })
            .eq('follower_id', session.user.id),
          supabase
            .from('user_image_likes')
            .select('*', { count: 'exact' })
            .eq('created_by', session.user.id),
          supabase
            .from('profiles')
            .select('credit_count, bonus_credits, followers_count, following_count')
            .eq('id', session.user.id)
            .single()
        ]);

        return {
          followers: profileResult.data?.followers_count || 0,
          following: profileResult.data?.following_count || 0,
          likes: likesResult.count || 0,
          credits: profileResult.data?.credit_count || 0,
          bonusCredits: profileResult.data?.bonus_credits || 0
        };
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return null;
      }
    },
    enabled: !!session?.user?.id
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const newAvatarUrl = await handleAvatarUpload(file, session.user.id);
        if (newAvatarUrl) {
          queryClient.invalidateQueries(['user']);
          toast.success("Profile picture updated successfully");
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error("Failed to update profile picture");
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-2xl py-8 space-y-6">
        <ProfileHeaderSection />
        
        <div className="grid gap-6">
          <ProfileImageSection 
            user={session.user}
            isPro={isPro}
            onImageUpload={handleImageUpload}
            onShowFullImage={() => setShowFullImage(true)}
          />

          {isStatsLoading ? (
            <div className="space-y-4">
              <div className="h-[200px] animate-pulse bg-muted rounded-lg" />
              <div className="h-[100px] animate-pulse bg-muted rounded-lg" />
            </div>
          ) : (
            <>
              <CreditsSection 
                credits={userStats?.credits}
                bonusCredits={userStats?.bonusCredits}
              />

              <StatsSection 
                followers={userStats?.followers}
                following={userStats?.following}
                likes={userStats?.likes}
              />
            </>
          )}

          <Button 
            variant="ghost" 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="max-w-screen-lg p-0">
          <div className="relative aspect-square">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={() => setShowFullImage(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <ProfileAvatar 
              user={session.user} 
              isPro={isPro} 
              size="xl" 
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;