import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import ProfileAvatar from './ProfileAvatar';
import ImageCard from '../ImageCard';

const UserProfileMenu = ({ userId, open, onOpenChange }) => {
  const { data: profile } = useQuery({
    queryKey: ['userProfile', userId],
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
      if (!userId) return 0;
      const { count, error } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('created_by', userId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId
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

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden">
        <ScrollArea className="h-full max-h-[calc(80vh-2rem)]">
          <div className="p-4 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <ProfileAvatar 
                user={{ user_metadata: { avatar_url: profile.avatar_url } }} 
                isPro={isPro}
                size="lg"
              />
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">{profile.display_name || 'Anonymous'}</h3>
                {isPro && (
                  <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 text-primary-foreground">
                    Pro User
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {totalLikes} Total Likes
                </p>
              </div>
            </div>

            {trendingImages && trendingImages.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Trending & Hot Images</h4>
                <div className="grid grid-cols-2 gap-4">
                  {trendingImages.map(image => (
                    <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                        alt={image.prompt}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileMenu;