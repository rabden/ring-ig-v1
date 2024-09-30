import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SignInDialog from '@/components/SignInDialog';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const MobileProfileMenu = ({ isOpen, onClose, user, userCredits }) => {
  const { logout } = useSupabaseAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
        </SheetHeader>
        {user ? (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
              <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">{user.user_metadata.display_name || user.email}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm font-medium">Credits: {userCredits?.credit_count || 0}</p>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <SignInDialog />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileProfileMenu;