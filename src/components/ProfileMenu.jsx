import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useProUser } from '@/hooks/useProUser';
import { useProRequest } from '@/hooks/useProRequest';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';
import { handleAvatarUpload } from '@/utils/profileUtils';
import { useQueryClient } from '@tanstack/react-query';
import ProfileHeader from './profile/ProfileHeader';
import ProfileStats from './profile/ProfileStats';
import ProfileCredits from './profile/ProfileCredits';
import ProfileActions from './profile/ProfileActions';
import ProfileAvatar from './profile/ProfileAvatar';
import { useFollowCounts } from '@/hooks/useFollowCounts';
import { useLikes } from '@/hooks/useLikes';
import { toast } from "sonner";

const ProfileMenu = ({ user, credits, bonusCredits }) => {
  const { logout } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''
  );
  const [showImageDialog, setShowImageDialog] = useState(false);
  const { data: isPro } = useProUser(user?.id);
  const { data: proRequest } = useProRequest(user?.id);
  const queryClient = useQueryClient();
  const { followersCount, followingCount } = useFollowCounts(user?.id);
  const { totalLikes } = useLikes(user?.id);

  useRealtimeProfile(user?.id);

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
            <ProfileHeader 
              user={user}
              isPro={isPro}
              displayName={displayName}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setDisplayName={setDisplayName}
              onUpdate={handleDisplayNameUpdate}
              onAvatarEdit={() => setShowImageDialog(true)}
            />
            
            <ProfileStats 
              followersCount={followersCount}
              followingCount={followingCount}
              totalLikes={totalLikes}
            />
            
            <ProfileCredits 
              credits={credits}
              bonusCredits={bonusCredits}
              isPro={isPro}
              proRequest={proRequest}
            />

            <ProfileActions onLogout={logout} />
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