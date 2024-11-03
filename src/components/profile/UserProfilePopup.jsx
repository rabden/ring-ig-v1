import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer } from 'vaul';
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileAvatar from './ProfileAvatar';
import ImageGallery from '../ImageGallery';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { useModelConfigs } from '@/hooks/useModelConfigs';

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
  setStyle,
  nsfwEnabled // Add this prop
}) => {
  const isMobile = window.innerWidth <= 768;
  const { data: modelConfigs } = useModelConfigs();
  const isNsfwModel = (model) => modelConfigs?.[model]?.category === "NSFW";
  
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

  const ProfileContent = () => (
    <>
      <div className="p-3 border-b">
        <div className="flex items-center gap-3">
          <ProfileAvatar 
            user={{ user_metadata: { avatar_url: userProfile.avatar_url } }}
            isPro={isPro}
            size="sm"
          />
          <div>
            <h2 className="text-base font-semibold">{userProfile.display_name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {totalLikes} likes
              </span>
              {isPro && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 text-black rounded-full">
                  PRO
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ScrollArea className={isMobile ? "h-[calc(96vh-100px)]" : "h-[calc(90vh-100px)]"}>
        <div className="p-6">
          <ImageGallery
            userId={authenticatedUserId}
            onImageClick={onImageClick}
            onDownload={onDownload}
            onRemix={onRemix}
            onViewDetails={onViewDetails}
            activeView="myImages"
            setActiveTab={setActiveTab}
            setStyle={setStyle}
            showDiscard={false}
            activeFilters={{ userId: userId }}
            nsfwEnabled={nsfwEnabled}
          />
        </div>
      </ScrollArea>
    </>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={onClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
          <Drawer.Content className="bg-background fixed inset-x-0 bottom-0 z-[60] rounded-t-[10px]">
            <div className="h-full max-h-[96vh] overflow-hidden">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 my-4" />
              <ProfileContent />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] p-0">
        <ProfileContent />
      </DialogContent>
    </Dialog>
  );
};

export default UserProfilePopup;