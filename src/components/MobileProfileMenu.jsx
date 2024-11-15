import React from 'react';
import { Button } from "@/components/ui/button";
import SignInDialog from '@/components/SignInDialog';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useProUser } from '@/hooks/useProUser';
import { useProRequest } from '@/hooks/useProRequest';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileHeader from './profile/ProfileHeader';
import ProfileStats from './profile/ProfileStats';
import ProfileCredits from './profile/ProfileCredits';
import ProfileActions from './profile/ProfileActions';
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';
import { handleAvatarUpload } from '@/utils/profileUtils';
import { useQueryClient } from '@tanstack/react-query';
import { useFollowCounts } from '@/hooks/useFollowCounts';
import { useLikes } from '@/hooks/useLikes';
import { toast } from "sonner";

const MobileProfileMenu = ({ user, credits, bonusCredits, activeTab }) => {
  const { logout } = useSupabaseAuth();
  const { data: isPro } = useProUser(user?.id);
  const { data: proRequest } = useProRequest(user?.id);
  const [isEditing, setIsEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState('');
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const queryClient = useQueryClient();
  const { followersCount, followingCount } = useFollowCounts(user?.id);
  const { totalLikes } = useLikes(user?.id);

  useRealtimeProfile(user?.id);

  React.useEffect(() => {
    if (user) {
      setDisplayName(
        user.user_metadata?.display_name || 
        (user.email ? user.email.split('@')[0] : '') || 
        ''
      );
    }
  }, [user]);

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

  if (activeTab !== 'profile') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="flex flex-col h-full">
        <div className="border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <ScrollArea className="flex-1">
          {user ? (
            <div className="p-4 space-y-6">
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
          ) : (
            <div className="flex flex-col items-center p-8 space-y-4">
              <SignInDialog />
            </div>
          )}
        </ScrollArea>
      </div>

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
    </div>
  );
};

export default MobileProfileMenu;