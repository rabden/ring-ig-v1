import React, { useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { handleAvatarUpload } from '@/utils/profileUtils';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import { ArrowLeft, Camera, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import LoadingScreen from '@/components/LoadingScreen';

const UserProfile = () => {
  const { session, loading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const { data: isPro } = useProUser(session?.user?.id);

  // Set display name when user data is available
  React.useEffect(() => {
    if (session?.user) {
      setDisplayName(session.user?.user_metadata?.display_name || session.user?.email?.split('@')[0] || '');
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
            .select('credits, bonus_credits')
            .eq('user_id', session.user.id)
            .single()
        ]);

        if (profileResult.error) {
          console.error('Profile fetch error:', profileResult.error);
          return {
            followers: followersResult.count || 0,
            following: followingResult.count || 0,
            likes: likesResult.count || 0,
            credits: 0,
            bonusCredits: 0
          };
        }
        
        return {
          followers: followersResult.count || 0,
          following: followingResult.count || 0,
          likes: likesResult.count || 0,
          credits: profileResult.data?.credits || 0,
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
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', session.user.id);

      toast.success("Display name updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries(['user']);
    } catch (error) {
      toast.error("Failed to update display name");
      console.error('Error updating display name:', error);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAvatarUrl = await handleAvatarUpload(file, session.user.id);
      if (newAvatarUrl) {
        queryClient.invalidateQueries(['user']);
        toast.success("Profile picture updated successfully");
      }
    }
  };

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect if not authenticated
  if (!session) {
    navigate('/');
    return null;
  }

  const MAX_CREDITS = 50;
  const creditsProgress = ((userStats?.credits || 0) / MAX_CREDITS) * 100;

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isStatsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <ProfileAvatar 
                    user={session.user} 
                    isPro={isPro} 
                    size="xl" 
                    className="w-24 h-24"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                    onClick={() => document.getElementById('avatar-input').click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="text-center">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="max-w-[200px]"
                      />
                      <Button onClick={handleDisplayNameUpdate}>Save</Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-medium">{displayName}</span>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    </div>
                  )}
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
              </div>

              <Separator />

              {/* Credits Section */}
              <div className="space-y-2">
                <Label>Credits</Label>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Credits</span>
                  <span>
                    {userStats?.credits || 0} 
                    <span className="text-muted-foreground"> / {MAX_CREDITS}</span>
                    {userStats?.bonusCredits > 0 && (
                      <span className="text-green-500 ml-1">+{userStats.bonusCredits}</span>
                    )}
                  </span>
                </div>
                <Progress value={creditsProgress} className="h-2" />
              </div>

              <Separator />

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-center">
                  <span className="text-2xl font-semibold block">{userStats?.followers || 0}</span>
                  <span className="text-muted-foreground text-sm">Followers</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-semibold block">{userStats?.following || 0}</span>
                  <span className="text-muted-foreground text-sm">Following</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-semibold block">{userStats?.likes || 0}</span>
                  <span className="text-muted-foreground text-sm">Likes</span>
                </div>
              </div>

              <Separator />

              {/* Sign Out Button */}
              <div className="flex justify-end">
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile; 