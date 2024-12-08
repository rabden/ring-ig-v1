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
import { ArrowLeft, Camera, LogOut, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import LoadingScreen from '@/components/LoadingScreen';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const UserProfile = () => {
  const { session, loading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries(['user']);
    } catch (error) {
      toast.error("Failed to update display name");
      console.error('Error updating display name:', error);
    }
  };

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

  const MAX_CREDITS = 50;
  const creditsProgress = ((userStats?.credits || 0) / MAX_CREDITS) * 100;

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      {/* Header */}
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
              <div className="flex flex-col items-center gap-6">
                <div className="relative flex items-center gap-4">
                  <div 
                    onClick={() => setShowFullImage(true)}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <ProfileAvatar 
                      user={session.user} 
                      isPro={isPro} 
                      size="xl" 
                      className="w-40 h-40"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => document.getElementById('avatar-input').click()}
                  >
                    <Upload className="h-5 w-5" />
                  </Button>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="text-center w-full max-w-sm">
                  <div className="flex items-center justify-center gap-2">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Input
                          value={tempDisplayName}
                          onChange={(e) => setTempDisplayName(e.target.value)}
                          className="text-xl font-medium text-center max-w-[200px]"
                          placeholder="Enter display name"
                        />
                        <Button onClick={handleDisplayNameUpdate}>Save</Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setTempDisplayName(displayName);
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-medium">{displayName}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">{session.user.email}</p>
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

      {/* Full Image Dialog */}
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