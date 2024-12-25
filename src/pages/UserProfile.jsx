import React, { useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Pencil, Camera, Calendar, Star, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { handleAvatarUpload } from '@/utils/profileUtils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import CreditCounter from "@/components/ui/credit-counter";
import ProfileStats from "@/components/profile/ProfileStats";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsCard = ({ title, children, icon: Icon, isPro }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-border/80 bg-card text-card-foreground relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
    <div className="p-6 relative">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
        {isPro && (
          <span className="text-xs bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 text-white px-2 py-1 rounded-full animate-gradient-x">
            Pro
          </span>
        )}
      </div>
    </div>
    <div className="p-6 pt-0 space-y-4 relative">
      {children}
    </div>
  </motion.div>
);

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton className="h-[200px] rounded-xl" />
      <Skeleton className="h-[200px] rounded-xl" />
    </div>
  </div>
);

const UserProfile = () => {
  const { session, loading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [tempDisplayName, setTempDisplayName] = useState('');
  const { data: isPro } = useProUser(session?.user?.id);

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!session?.user?.id
  });

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

  if (loading || isStatsLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!session) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container max-w-6xl mx-auto py-8 px-4 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="group hover:opacity-80">
            <ArrowLeft className="h-6 w-6 group-hover:text-primary transition-colors duration-300" />
          </Link>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1 mb-8"
        >
          <h1 className="text-3xl font-medium tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account, billing, and team settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <SettingsCard title="Basic Information" icon={Star}>
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-border ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-primary">
                    <AvatarImage
                      src={profile?.avatar_url || session.user.user_metadata?.avatar_url}
                      alt={displayName}
                    />
                    <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={onAvatarUpload}
                    />
                  </label>
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-medium">Name</div>
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {displayName}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Email</div>
                <div className="text-muted-foreground">{session.user.email}</div>
              </div>
            </SettingsCard>

            <SettingsCard title="Account" icon={CreditCard} isPro={isPro}>
              <CreditCounter 
                credits={userStats?.credits || 0} 
                bonusCredits={userStats?.bonusCredits || 0}
              />
              {!isPro && (
                <Button className="w-full bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 text-white hover:opacity-90">
                  Upgrade to Pro
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 group"
              >
                <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Sign out
              </Button>
            </SettingsCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SettingsCard title="Stats" icon={Calendar}>
              <ProfileStats 
                followersCount={userStats?.followers || 0}
                followingCount={userStats?.following || 0}
                totalLikes={userStats?.likes || 0}
              />
            </SettingsCard>
          </div>
        </div>

        <AnimatePresence>
          {isEditing && (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Display Name
                    </label>
                    <Input
                      id="name"
                      value={tempDisplayName}
                      onChange={(e) => setTempDisplayName(e.target.value)}
                      className="focus-visible:ring-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleDisplayNameUpdate}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UserProfile;
