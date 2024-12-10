import React, { useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProfileHeaderSection from '@/components/profile/sections/ProfileHeaderSection';
import CreditsSection from '@/components/profile/sections/CreditsSection';
import StatsSection from '@/components/profile/sections/StatsSection';
import { handleAvatarUpload } from '@/utils/profileUtils';

const UserProfile = () => {
  const { session, loading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [tempDisplayName, setTempDisplayName] = useState('');
  const { data: isPro } = useProUser(session?.user?.id);
  const [showFullImage, setShowFullImage] = useState(false);

  React.useEffect(() => {
    if (session?.user) {
      const name = session.user?.user_metadata?.display_name || session.user?.email?.split('@')[0] || '';
      setDisplayName(name);
      setTempDisplayName(name);
    }
  }, [session]);

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
        return {
          followers: 0,
          following: 0,
          likes: 0,
          credits: 0,
          bonusCredits: 0
        };
      }
    },
    enabled: !!session?.user?.id
  });

  const handleDisplayNameUpdate = async () => {
    if (tempDisplayName.trim() === displayName.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: tempDisplayName }
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ display_name: tempDisplayName })
        .eq('id', session.user.id);

      setDisplayName(tempDisplayName);
      toast.success("Display name updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update display name");
      console.error('Error updating display name:', error);
    }
  };

  const onAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAvatarUrl = await handleAvatarUpload(file, session.user.id);
      if (newAvatarUrl) {
        toast.success("Profile picture updated successfully");
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 px-2 sm:px-4">
      <div className="container mx-auto py-2 sm:py-4 space-y-0 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-background/80">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Profile Settings</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>

        {isStatsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <ProfileHeaderSection
              user={session.user}
              isPro={isPro}
              displayName={displayName}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setDisplayName={setTempDisplayName}
              onUpdate={handleDisplayNameUpdate}
              onAvatarEdit={() => setShowFullImage(true)}
              onAvatarUpload={onAvatarUpload}
            />
            
            <CreditsSection userStats={userStats} />
            
            <StatsSection userStats={userStats} />
          </div>
        )}

        {/* Full Image Dialog */}
        <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
          <DialogContent className="p-0 max-h-[90vh] overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={session.user.user_metadata?.avatar_url}
                alt={session.user.email}
                className="w-full h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
