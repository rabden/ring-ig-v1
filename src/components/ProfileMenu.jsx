import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { useProRequest } from '@/hooks/useProRequest';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';
import { handleAvatarUpload } from '@/utils/profileUtils';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, ChevronRight } from 'lucide-react';
import ProfileAvatar from './profile/ProfileAvatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const ProfileMenu = ({ user, credits, bonusCredits }) => {
  const { logout } = useSupabaseAuth();
  const [showImageDialog, setShowImageDialog] = useState(false);
  const { data: isPro } = useProUser(user?.id);
  const queryClient = useQueryClient();

  useRealtimeProfile(user?.id);

  const { data: followCounts = { followers: 0, following: 0 } } = useQuery({
    queryKey: ['followCounts', user?.id],
    queryFn: async () => {
      if (!user?.id) return { followers: 0, following: 0 };
      
      const [followersResult, followingResult] = await Promise.all([
        supabase
          .from('user_follows')
          .select('*', { count: 'exact' })
          .eq('following_id', user.id),
        supabase
          .from('user_follows')
          .select('*', { count: 'exact' })
          .eq('follower_id', user.id)
      ]);
      
      return {
        followers: followersResult.count || 0,
        following: followingResult.count || 0
      };
    },
    enabled: !!user?.id
  });

  const { data: totalLikes = 0 } = useQuery({
    queryKey: ['totalLikes', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('created_by', user.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id
  });

  const onAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    const newAvatarUrl = await handleAvatarUpload(file, user?.id);
    if (newAvatarUrl) {
      queryClient.invalidateQueries(['user']);
      setShowImageDialog(false);
    }
  };

  if (!user) return null;

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || '';
  const MAX_CREDITS = 50;
  const creditsProgress = (credits / MAX_CREDITS) * 100;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
            <ProfileAvatar user={user} isPro={isPro} size="sm" showEditOnHover={false} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4" align="end" side="bottom" alignOffset={-8}>
          <div className="space-y-4">
            {/* Profile Header with Link */}
            <Link to="/userprofile" className="flex items-center gap-3 group hover:bg-accent rounded-md p-2 -m-2 transition-colors">
              <ProfileAvatar 
                user={user} 
                isPro={isPro} 
                size="sm" 
                showEditOnHover={true}
                onClick={() => setShowImageDialog(true)}
                className="w-8 h-8"
              />
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h4 className="font-medium text-base leading-tight truncate">{displayName}</h4>
                <p className="text-sm text-muted-foreground leading-tight truncate">{user.email}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            {/* Credits Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credits</span>
                <span>{credits} <span className="text-muted-foreground">/ {MAX_CREDITS}</span> {bonusCredits > 0 && <span className="text-green-500">+{bonusCredits}</span>}</span>
              </div>
              <Progress value={creditsProgress} className="h-2" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-sm py-2">
              <div className="text-center">
                <span className="font-medium block">{followCounts.followers}</span>
                <span className="text-muted-foreground text-xs">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-medium block">{followCounts.following}</span>
                <span className="text-muted-foreground text-xs">Following</span>
              </div>
              <div className="text-center">
                <span className="font-medium block">{totalLikes}</span>
                <span className="text-muted-foreground text-xs">Likes</span>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="flex justify-end pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logout()}
                className="text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Sign out
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Profile Picture</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to upload a new profile picture?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = onAvatarUpload;
              input.click();
            }}>
              Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileMenu;