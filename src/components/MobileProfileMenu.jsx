import React from 'react';
import { Button } from "@/components/ui/button";
import SignInDialog from '@/components/SignInDialog';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import ProUpgradeForm from './pro/ProUpgradeForm';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ProfileAvatar from './profile/ProfileAvatar';
import DisplayNameEditor from './profile/DisplayNameEditor';
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';

const MobileProfileMenu = ({ user, credits, bonusCredits, activeTab }) => {
  const { logout } = useSupabaseAuth();
  const { data: isPro } = useProUser(user?.id);
  const [upgradeFormOpen, setUpgradeFormOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(
    user?.user_metadata?.display_name || user.email?.split('@')[0] || ''
  );
  const [showImageDialog, setShowImageDialog] = React.useState(false);

  // Enable real-time updates
  useRealtimeProfile(user?.id);

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

  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      toast.success('Profile picture updated successfully');
      setShowImageDialog(false);
    } catch (error) {
      toast.error('Failed to update profile picture');
      console.error('Error updating profile picture:', error);
    }
  };

  if (activeTab !== 'profile') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden pt-14 pb-20">
      <div className="h-[calc(100vh-8.5rem)] overflow-y-auto">
        <div className="p-6">
          {user ? (
            <div className="flex flex-col items-center space-y-8">
              <ProfileAvatar 
                user={user} 
                isPro={isPro} 
                size="lg" 
                onEditClick={() => setShowImageDialog(true)}
              />
              <div className="text-center space-y-2">
                <DisplayNameEditor
                  isEditing={isEditing}
                  displayName={displayName}
                  setDisplayName={setDisplayName}
                  onEdit={() => setIsEditing(true)}
                  onUpdate={handleDisplayNameUpdate}
                  size="lg"
                />
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {isPro && (
                  <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">
                    Pro User
                  </div>
                )}
              </div>
              
              <div className="w-full space-y-6">
                <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1.5 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Credits</p>
                    <p className="text-2xl font-bold">{credits}+B{bonusCredits}</p>
                  </div>
                  <div className="space-y-1.5 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                    <p className="text-2xl font-bold">{totalLikes}</p>
                  </div>
                </div>
                {!isPro && (
                  <Button 
                    variant="default" 
                    className="w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 hover:from-yellow-400 hover:via-yellow-600 hover:to-amber-600"
                    onClick={() => setUpgradeFormOpen(true)}
                  >
                    Upgrade to Pro
                  </Button>
                )}
                <Button onClick={() => logout()} variant="outline" className="w-full">
                  Log out
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 pt-8">
              <SignInDialog />
            </div>
          )}
        </div>
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
              input.onchange = handleAvatarUpload;
              input.click();
            }}>
              Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProUpgradeForm 
        open={upgradeFormOpen}
        onOpenChange={setUpgradeFormOpen}
      />
    </div>
  );
};

export default MobileProfileMenu;
