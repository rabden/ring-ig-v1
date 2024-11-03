import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import ImageCard from '../ImageCard';
import { useProUser } from '@/hooks/useProUser';

const UserProfileMenu = ({ userId, trigger, onClose }) => {
  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: isPro } = useProUser(userId);

  const { data: totalLikes = 0 } = useQuery({
    queryKey: ['totalLikes', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('created_by', userId);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });

  const { data: trendingImages } = useQuery({
    queryKey: ['userTrendingImages', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('user_id', userId)
        .or('is_trending.eq.true,is_hot.eq.true')
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-6">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className={`rounded-full ${isPro ? 'p-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
                <div className={`h-20 w-20 rounded-full overflow-hidden ${isPro ? 'border-2 border-background' : ''}`}>
                  <img 
                    src={profile?.avatar_url} 
                    alt={profile?.display_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{profile?.display_name || 'Anonymous'}</h3>
                {isPro && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 text-background">
                    Pro
                  </span>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Total Likes: {totalLikes}
                </p>
              </div>
            </div>

            {trendingImages?.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Trending & Hot Images</h4>
                <div className="grid grid-cols-2 gap-4">
                  {trendingImages.map((image) => (
                    <div key={image.id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfileMenu;