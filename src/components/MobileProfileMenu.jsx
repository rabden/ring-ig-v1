import React from 'react';
import { Button } from "@/components/ui/button";
import SignInDialog from '@/components/SignInDialog';
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

const MobileProfileMenu = ({ user, credits, bonusCredits, activeTab }) => {
  const { logout } = useSupabaseAuth();
  const { data: isPro } = useProUser(user?.id);
  const { data: proRequest } = useProRequest(user?.id);
  const [isEditing, setIsEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState('');
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (user) {
      setDisplayName(
        user.user_metadata?.display_name || 
        (user.email ? user.email.split('@')[0] : '') || 
        ''
      );
    }
  }, [user]);

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

  const onAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    const newAvatarUrl = await handleAvatarUpload(file, user?.id);
    if (newAvatarUrl) {
      queryClient.invalidateQueries(['user']);
      setShowImageDialog(false);
    }
  };

  const handleProRequest = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_pro_request: true })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Pro request submitted successfully");
      queryClient.invalidateQueries(['proRequest', user.id]);
    } catch (error) {
      toast.error("Failed to submit pro request");
      console.error('Error submitting pro request:', error);
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
                {!isPro && !proRequest && (
                  <Button 
                    variant="default" 
                    className="w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 hover:from-yellow-400 hover:via-yellow-600 hover:to-amber-600"
                    onClick={handleProRequest}
                  >
                    Request Pro Access
                  </Button>
                )}
                {!isPro && proRequest && (
                  <div className="text-sm text-center text-muted-foreground p-4 bg-muted rounded-lg">
                    Your request to upgrade to Pro is being reviewed by our team
                  </div>
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