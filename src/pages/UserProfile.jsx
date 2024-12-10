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
import CreditCounter from "@/components/ui/credit-counter";

const UserProfile = () => {
  const { session, loading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [tempDisplayName, setTempDisplayName] = useState('');
  const { data: isPro } = useProUser(session?.user?.id);

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
      <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="hover:opacity-80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>
        
        <div className="space-y-1 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information Card */}
              <div className="rounded-xl border border-border/40 bg-card text-card-foreground">
                <div className="flex items-center justify-between p-6">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
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
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={session.user.user_metadata?.avatar_url}
                        alt={displayName}
                      />
                      <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
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

              {/* Credits Card */}
              <div className="rounded-xl border border-border/40 bg-card text-card-foreground">
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Account</h2>
                    {isPro && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Pro Trial
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-0 space-y-6">
                  <CreditCounter 
                    credits={userStats?.credits || 0} 
                    bonusCredits={userStats?.bonusCredits || 0}
                  />
                  <div className="flex gap-2">
                    <Button className="w-full" variant="default">
                      Upgrade to Pro
                    </Button>
                    <Button className="w-full" variant="outline">
                      Upgrade to Business
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Usage Card */}
              <div className="rounded-xl border border-border/40 bg-card text-card-foreground">
                <div className="p-6">
                  <h2 className="text-xl font-semibold">Usage</h2>
                </div>
                <div className="p-6 pt-0 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Premium models</div>
                      <div className="text-lg font-medium">0 / 500</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        You've used no requests out of your 500 fast requests quota.
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">gpt-4o-mini or cursor-small</div>
                      <div className="text-lg font-medium">0 / No Limit</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        You've used 0 fast requests of this model. You have no monthly quota.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
