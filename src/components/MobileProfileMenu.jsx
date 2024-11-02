import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SignInDialog from '@/components/SignInDialog';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';

const MobileProfileMenu = ({ user, credits, bonusCredits, activeTab }) => {
  const { logout } = useSupabaseAuth();
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

  if (activeTab !== 'profile') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden pt-16 pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border/40">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold tracking-tight">Profile</h2>
        </div>
      </div>
      <div className="h-[calc(100vh-9rem)] overflow-y-auto">
        <div className="p-4">
          {user ? (
            <div className="flex flex-col items-center space-y-6">
              <div className={`rounded-full ${isPro ? 'p-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
                <Avatar className={`h-24 w-24 ${isPro ? 'border-3 border-background rounded-full' : ''}`}>
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">
                  {user.user_metadata?.display_name || user.email}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {isPro && (
                  <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                    Pro User
                  </div>
                )}
              </div>
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Credits</p>
                    <p className="text-2xl font-bold">{credits}+B{bonusCredits}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Likes</p>
                    <p className="text-2xl font-bold">{totalLikes}</p>
                  </div>
                </div>
                <Button onClick={logout} variant="outline" className="w-full">
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
    </div>
  );
};

export default MobileProfileMenu;