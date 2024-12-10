import React, { useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Pencil, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { handleAvatarUpload } from '@/utils/profileUtils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-medium tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            You can manage your account, billing, and team settings here.
          </p>
        </div>

        {isStatsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Information Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">Basic Information</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={session.user.user_metadata?.avatar_url}
                        alt={displayName}
                      />
                      <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Name</div>
                    <div className="text-muted-foreground">{displayName}</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-muted-foreground">{session.user.email}</div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h2 className="text-2xl font-semibold tracking-tight">Stats</h2>
              </div>
              <div className="p-6 pt-0 grid gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">Followers</div>
                    <div>{userStats?.followers.toLocaleString()}</div>
                  </div>
                  <Progress value={userStats?.followers / 10} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">Following</div>
                    <div>{userStats?.following.toLocaleString()}</div>
                  </div>
                  <Progress value={userStats?.following / 10} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">Likes</div>
                    <div>{userStats?.likes.toLocaleString()}</div>
                  </div>
                  <Progress value={userStats?.likes / 10} />
                </div>
              </div>
            </div>

            {/* Credits Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">Credits</h2>
                  {isPro && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Pro Trial
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 pt-0 space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="text-muted-foreground">Standard Credits</div>
                      <div>{userStats?.credits.toLocaleString()}</div>
                    </div>
                    <Progress value={(userStats?.credits / 500) * 100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="text-muted-foreground">Bonus Credits</div>
                      <div>{userStats?.bonusCredits.toLocaleString()}</div>
                    </div>
                    <Progress value={(userStats?.bonusCredits / 500) * 100} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="w-full" variant="default">
                    Upgrade to Pro
                  </Button>
                  <Button className="w-full" variant="outline">
                    Upgrade to Business
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Section */}
            <div className="pt-4">
              <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                Delete Account
              </Button>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={session.user.user_metadata?.avatar_url}
                      alt={displayName}
                    />
                    <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <Input
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    placeholder="Display Name"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDisplayNameUpdate}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
