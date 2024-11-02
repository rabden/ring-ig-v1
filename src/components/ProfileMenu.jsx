import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';

const ProfileMenu = ({ user, credits, bonusCredits }) => {
  const { signOut } = useSupabaseAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: isPro } = useProUser(user?.id);

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

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
          <div className={`rounded-full ${isPro ? 'p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
            <Avatar className={`h-7 w-7 ${isPro ? 'border-2 border-background rounded-full' : ''}`}>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] p-6 m-4 rounded-lg border max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className={`rounded-full ${isPro ? 'p-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
              <Avatar className={`h-20 w-20 ${isPro ? 'border-2 border-background rounded-full' : ''}`}>
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {user.user_metadata?.display_name || user.email}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {isPro && <p className="text-sm text-primary mt-1">Pro User</p>}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Credits</span>
                  <span className="text-sm">{credits}+ B{bonusCredits}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Likes</span>
                  <span className="text-sm">{totalLikes}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileMenu;
