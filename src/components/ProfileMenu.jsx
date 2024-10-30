import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { LogOut, CreditCard } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ProfileMenu = ({ user, credits, bonusCredits }) => {
  const { logout } = useSupabaseAuth();
  const displayName = user.user_metadata.display_name || user.email.split('@')[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata.avatar_url} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-none">
          <div className="flex items-center gap-4 p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata.avatar_url} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{displayName}</h4>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="border-t border-border/5">
            <div className="flex items-center gap-4 p-4">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">Credits Available</p>
                <p className="text-xs text-muted-foreground">
                  {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''} credits
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-border/5">
            <Button 
              variant="ghost" 
              className="w-full justify-start rounded-none h-11 px-4 hover:bg-secondary/80" 
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileMenu;