import React from 'react';
import { Drawer } from 'vaul';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SignInDialog from '@/components/SignInDialog';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { User, LogOut, CreditCard } from 'lucide-react';

const MobileProfileMenu = ({ user, credits, bonusCredits }) => {
  const { logout } = useSupabaseAuth();

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <User size={20} />
          )}
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="fixed inset-0 bg-background flex flex-col z-[60]">
          <div className="flex-1 p-4">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-6" />
            <div className="max-w-md mx-auto space-y-6">
              {user ? (
                <>
                  <div className="flex flex-col items-center space-y-3 pt-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">
                        {user.user_metadata.display_name || user.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Available Credits</p>
                        <p className="text-2xl font-bold mt-1">
                          {credits} + {bonusCredits}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={logout} 
                    variant="outline" 
                    className="w-full h-11"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-4 pt-8">
                  <SignInDialog />
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileProfileMenu;