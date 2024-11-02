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
    <div className="fixed inset-0 z-50 bg-background md:hidden pt-16 pb-20 overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border/40 pb-3">
        <h2 className="px-4 text-lg font-semibold">Profile</h2>
      </div>
      <div className="p-4">
        {user ? (
          <div className="flex flex-col items-center space-y-4">
            <div className={`rounded-full ${isPro ? 'p-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
              <Avatar className={`h-20 w-20 ${isPro ? 'border-2 border-background rounded-full' : ''}`}>
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-lg font-semibold">
              {user.user_metadata?.display_name || user.email}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {isPro && <p className="text-sm text-primary">Pro User</p>}
            <p className="text-sm font-medium">
              Credits: {credits}+ B{bonusCredits}
            </p>
            <p className="text-sm font-medium">
              Total Likes: {totalLikes}
            </p>
            <Button onClick={logout} variant="outline" className="w-full">
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <SignInDialog />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProfileMenu;