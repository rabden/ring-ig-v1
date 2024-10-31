import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DesktopProfileMenu = ({ user, credits, bonusCredits }) => {
  const { logout } = useSupabaseAuth();
  const displayName = user.user_metadata.display_name || user.email.split('@')[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata.avatar_url} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0">
          <div className="p-6 flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata.avatar_url} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center">
              <h4 className="text-lg font-semibold">{displayName}</h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="text-sm font-medium">
              Credits: {credits} + B{bonusCredits}
            </div>
            <Button onClick={logout} variant="outline" className="w-full">
              Log out
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default DesktopProfileMenu;
