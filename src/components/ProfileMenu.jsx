import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ProfileMenu = ({ user, credits, bonusCredits }) => {
  const { signOut } = useSupabaseAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">Credits: {credits + bonusCredits}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileMenu;