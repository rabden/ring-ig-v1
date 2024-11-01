import React from 'react';
import { Drawer } from 'vaul';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import SignInDialog from '@/components/SignInDialog';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const MobileProfileMenu = ({ user, credits, bonusCredits, proMode, setProMode }) => {
  const { logout } = useSupabaseAuth();
  const [snapPoint, setSnapPoint] = React.useState(1);

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
        <Drawer.Content className="bg-background flex flex-col rounded-t-[20px] fixed bottom-0 left-0 right-0 max-h-[100dvh] z-[60]">
          <div className="p-4 bg-muted/40 rounded-t-[20px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-8" />
            <div className="max-w-md mx-auto">
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
                  <p className="text-sm font-medium">
                    Credits: {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''}
                  </p>
                  <p className="text-sm font-medium">
                    Total Likes: {totalLikes}
                  </p>
                  <div className="flex items-center justify-between w-full px-4 py-2">
                    <span className="text-sm font-medium">Pro Mode</span>
                    <Switch checked={proMode} onCheckedChange={setProMode} />
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
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileProfileMenu;