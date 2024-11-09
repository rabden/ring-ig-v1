import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SignInDialog from '@/components/SignInDialog';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { CreditCard, LogOut } from 'lucide-react';
import ProfileHeader from './profile/ProfileHeader';
import FollowStats from './social/FollowStats';

const MobileProfileMenu = ({ user, credits, bonusCredits, activeTab }) => {
  const { logout } = useSupabaseAuth();
  const { data: isPro } = useProUser(user?.id);
  const { data: proRequest } = useProRequest(user?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || 
    (user?.email ? user.email.split('@')[0] : '') || 
    ''
  );
  const [showImageDialog, setShowImageDialog] = useState(false);
  const queryClient = useQueryClient();

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

  if (activeTab !== 'profile') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="flex flex-col h-full">
        <div className="border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <ScrollArea className="flex-1">
          {user ? (
            <div className="p-4 space-y-4">
              <ProfileHeader 
                user={user}
                isPro={isPro}
                isEditing={isEditing}
                displayName={displayName}
                setDisplayName={setDisplayName}
                onEdit={() => setIsEditing(true)}
                onUpdate={handleDisplayNameUpdate}
                onEditClick={() => setShowImageDialog(true)}
                showEditOnHover={true}
              />

              <Card className="p-4 grid grid-cols-2 gap-4">
                <div className="text-center space-y-1">
                  <p className="text-2xl font-bold">{credits}+{bonusCredits}</p>
                  <p className="text-sm text-muted-foreground">Credits</p>
                </div>
              </Card>

              <div className="space-y-2">
                {!isPro && !proRequest && (
                  <Button 
                    variant="default" 
                    className="w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 hover:from-yellow-400 hover:via-yellow-600 hover:to-amber-600"
                    onClick={handleProRequest}
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
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </div>
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
