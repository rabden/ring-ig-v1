import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SignInDialog from '@/components/SignInDialog';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { User } from 'lucide-react';

const MobileProfileMenu = ({ user, credits, nsfwEnabled, setNsfwEnabled }) => {
  const { logout } = useSupabaseAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
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
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] px-6">
        <SheetHeader className="pb-4">
          <SheetTitle>{user ? 'Profile' : 'Sign In'}</SheetTitle>
        </SheetHeader>
        {user ? (
          <div className="flex flex-col items-center space-y-6 mt-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
              <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">{user.user_metadata.display_name || user.email}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm font-medium">Credits: {credits}</p>
            </div>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>NSFW Content</Label>
                  <p className="text-sm text-muted-foreground">Enable NSFW content generation</p>
                </div>
                <Switch
                  checked={nsfwEnabled}
                  onCheckedChange={setNsfwEnabled}
                />
              </div>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                Log out
              </Button>
            </div>
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