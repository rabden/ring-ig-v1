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
import ProfileStats from "@/components/profile/ProfileStats";
import { cn } from "@/lib/utils";

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
      <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "hover:bg-accent/10 text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-medium tracking-tight text-foreground/90">Settings</h1>
          <p className="text-base text-muted-foreground/70">
            Manage your account, billing, and team settings.
          </p>
        </div>

        {isStatsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information Card */}
              <div className={cn(
                "rounded-xl border border-border/20 bg-card/40",
                "backdrop-blur-sm shadow-[0_0_0_1px] shadow-border/10"
              )}>
                <div className="flex items-center justify-between p-6">
                  <h2 className="text-xl font-semibold text-foreground/90">Basic Information</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="text-muted-foreground/60 hover:text-foreground/80"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6 pt-0 space-y-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-border/20">
                      <AvatarImage
                        src={session.user.user_metadata?.avatar_url}
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-accent/10 text-foreground/80">
                        {displayName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5">
                      <div className="font-medium text-sm text-muted-foreground/70">Name</div>
                      <div className="text-foreground/90">{displayName}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="font-medium text-sm text-muted-foreground/70">Email</div>
                    <div className="text-foreground/90">{session.user.email}</div>
                  </div>
                </div>
              </div>

              {/* Credits Card */}
              <div className={cn(
                "rounded-xl border border-border/20 bg-card/40",
                "backdrop-blur-sm shadow-[0_0_0_1px] shadow-border/10"
              )}>
                <div className="p-6">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-semibold text-foreground/90">Account</h2>
                    {isPro && (
                      <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full",
                        "bg-primary/15 text-primary/90",
                        "ring-1 ring-primary/20"
                      )}>
                        Pro
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-0 space-y-6">
                  <CreditCounter 
                    credits={userStats?.credits || 0} 
                    bonusCredits={userStats?.bonusCredits || 0}
                  />
                  {!isPro && (
                    <Button className="w-full" variant="default">
                      Upgrade to Pro
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className={cn(
                      "w-full text-destructive/70",
                      "hover:text-destructive/90 hover:bg-destructive/10"
                    )}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className={cn(
                "rounded-xl border border-border/20 bg-card/40",
                "backdrop-blur-sm shadow-[0_0_0_1px] shadow-border/10"
              )}>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-foreground/90">Stats</h2>
                </div>
                <div className="p-6 pt-0">
                  <ProfileStats 
                    followersCount={userStats?.followers || 0}
                    followingCount={userStats?.following || 0}
                    totalLikes={userStats?.likes || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground/90">
                Edit Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-16 w-16 ring-2 ring-border/20">
                    <AvatarImage
                      src={session.user.user_metadata?.avatar_url}
                      alt={displayName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-accent/10 text-foreground/80">
                      {displayName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    "bg-black/50 opacity-0 group-hover:opacity-100",
                    "transition-opacity rounded-full cursor-pointer"
                  )}>
                    <Camera className="w-6 h-6 text-white/90" />
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
                    className="bg-accent/5 border-border/20"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsEditing(false)}
                  className="text-muted-foreground/70 hover:text-foreground/80"
                >
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
