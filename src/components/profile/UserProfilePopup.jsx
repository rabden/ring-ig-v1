import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileAvatar from './ProfileAvatar';
import ImageGallery from '../ImageGallery';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';

const UserProfilePopup = ({ 
  userId, 
  isOpen, 
  onClose, 
  authenticatedUserId,
  onImageClick,
  onDownload,
  onRemix,
  onViewDetails,
  setActiveTab,
  setStyle
}) => {
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId && isOpen,
  });

  const { data: isPro } = useProUser(userId);

  const { data: totalLikes = 0 } = useQuery({
    queryKey: ['userTotalLikes', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('created_by', userId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId && isOpen,
  });

  if (!userProfile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] p-0">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <ProfileAvatar 
              user={{ user_metadata: { avatar_url: userProfile.avatar_url } }}
              isPro={isPro}
              size="md"
            />
            <div>
              <h2 className="text-xl font-semibold">{userProfile.display_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {totalLikes} likes
                </span>
                {isPro && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 text-black rounded-full">
                    PRO
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(90vh-150px)]">
          <div className="p-6">
            <ImageGallery
              userId={userId}
              authenticatedUserId={authenticatedUserId}
              onImageClick={onImageClick}
              onDownload={onDownload}
              onRemix={onRemix}
              onViewDetails={onViewDetails}
              activeView="userImages"
              setActiveTab={setActiveTab}
              setStyle={setStyle}
              showDiscard={false}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfilePopup;