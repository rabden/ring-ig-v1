import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { useProRequest } from '@/hooks/useProRequest';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ProfileAvatar from './profile/ProfileAvatar';
import DisplayNameEditor from './profile/DisplayNameEditor';
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';
import { handleAvatarUpload } from '@/utils/profileUtils';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Settings, CreditCard, Heart, LogOut } from 'lucide-react';
import FollowStats from './profile/FollowStats';

const ProfileMenu = ({ user, credits, bonusCredits }) => {
  const { logout } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [upgradeFormOpen, setUpgradeFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''
  );
  const [showImageDialog, setShowImageDialog] = useState(false);
  const { data: isPro } = useProUser(user?.id);
  const { data: proRequest } = useProRequest(user?.id);
  const queryClient = useQueryClient();

  // Enable real-time updates
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

  const handleDisplayNameUpdate = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      toast.success("Display name updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update display name");
      console.error('Error updating display name:', error);
    }
  };

  const onAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    const newAvatarUrl = await handleAvatarUpload(file, user?.id);
    if (newAvatarUrl) {
      queryClient.invalidateQueries(['user']);
      setShowImageDialog(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
            <ProfileAvatar user={user} isPro={isPro} size="sm" showEditOnHover={false} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px] sm:w-[540px] p-6 m-4 rounded-lg border max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <ProfileAvatar 
                user={user} 
                isPro={isPro} 
                size="md" 
                onEditClick={() => setShowImageDialog(true)}
                showEditOnHover={true}
              />
              <div className="text-center">
                <DisplayNameEditor
                  isEditing={isEditing}
                  displayName={displayName}
                  setDisplayName={setDisplayName}
                  onEdit={() => setIsEditing(true)}
                  onUpdate={handleDisplayNameUpdate}
                  size="md"
                />
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {isPro && <p className="text-sm text-primary mt-1">Pro User</p>}
              </div>
              <FollowStats 
                followersCount={followCounts.followers}
                followingCount={followCounts.following}
              />
            </div>
            
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Credits</span>
                    <span className="text-sm">{credits}+ B{bonusCredits}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Likes</span>
                    <span className="text-sm">{totalLikes}</span>
                  </div>
                </div>
              </div>
              
              {!isPro && !proRequest && (
                <Button 
                  variant="default" 
                  className="w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 hover:from-yellow-400 hover:via-yellow-600 hover:to-amber-600"
                  onClick={() => toast.error("Pro request feature not implemented")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Request Pro Access
                </Button>
              )}
              {!isPro && proRequest && (
                <div className="text-sm text-center text-muted-foreground p-3 bg-muted rounded-lg">
                  Pro request under review
                </div>
              )}
              <Button variant="outline" className="w-full" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
