import React from 'react';
import { Drawer } from 'vaul';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import SignInDialog from '@/components/SignInDialog';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { User, X } from 'lucide-react';

const MobileProfileMenu = ({ user, credits, bonusCredits }) => {
  const { logout } = useSupabaseAuth();
  const [snapPoint, setSnapPoint] = React.useState(1);

  const handleLogout = () => {
    logout();
  };

  return (
    <Drawer.Root 
      snapPoints={[1, 100]} 
      activeSnapPoint={snapPoint}
      setActiveSnapPoint={setSnapPoint}
    >
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
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 max-h-[90vh] z-[60]">
          <div className="p-4 bg-muted/40 rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-8" />
            <ScrollArea className="h-full max-h-[calc(90vh-100px)]">
              <div className="max-w-md mx-auto px-4">
                {user ? (
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">
                      {user.user_metadata.display_name || user.email}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 bg-secondary p-3 rounded-lg w-full">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Credits</p>
                        <p className="text-2xl font-bold">{credits}</p>
                      </div>
                      {bonusCredits > 0 && (
                        <div className="flex-1">
                          <p className="text-sm font-medium">Bonus</p>
                          <p className="text-2xl font-bold text-primary">+{bonusCredits}</p>
                        </div>
                      )}
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full">
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <SignInDialog />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileProfileMenu;