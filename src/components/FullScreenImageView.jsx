import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useLikes } from '@/hooks/useLikes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRemixNavigation } from '@/utils/remixUtils';
import ImagePromptSection from './image-view/ImagePromptSection';
import ImageDetailsSection from './image-view/ImageDetailsSection';
import ImageOwnerHeader from './image-view/ImageOwnerHeader';
import ImageViewHeader from './image-view/ImageViewHeader';
import ImageViewActions from './image-view/ImageViewActions';
import HeartAnimation from './animations/HeartAnimation';
import { handleImageDiscard } from '@/utils/discardUtils';
import { ScrollArea } from "@/components/ui/scroll-area";

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDownload,
  onDiscard,
  isOwner,
  setStyle,
  setActiveTab 
}) => {
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  const [isAnimating, setIsAnimating] = useState(false);
  const { userLikes, toggleLike } = useLikes(session?.user?.id);
  const queryClient = useQueryClient();

  const { handleRemixRedirect } = useRemixNavigation(
    () => {}, // These are placeholder functions since we're only using handleRemixRedirect
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {}
  );

  const { data: owner } = useQuery({
    queryKey: ['user', image?.user_id],
    queryFn: async () => {
      if (!image?.user_id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', image.user_id)
        .single();
      return data;
    },
    enabled: !!image?.user_id
  });

  const { data: likeCount = 0 } = useQuery({
    queryKey: ['likes', image?.id],
    queryFn: async () => {
      if (!image?.id) return 0;
      const { count } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('image_id', image.id);
      return count || 0;
    },
    enabled: !!image?.id
  });

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(image.user_prompt || image.prompt);
    setCopyIcon('check');
    setTimeout(() => setCopyIcon('copy'), 1500);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/image/${image.id}`);
    setShareIcon('check');
    setTimeout(() => setShareIcon('share'), 1500);
  };

  const handleDiscardImage = async () => {
    try {
      await handleImageDiscard(image, queryClient);
      onClose();
    } catch (error) {
      console.error('Error in handleDiscard:', error);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userLikes?.includes(image?.id)) {
      setIsAnimating(true);
      toggleLike(image?.id);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  const handleRemixClick = () => {
    handleRemixRedirect(image);
    onClose();
  };

  const detailItems = image ? [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio || "1:1" },
    { label: "Quality", value: image.quality },
    { label: "Created", value: format(new Date(image.created_at), 'MMM d, yyyy h:mm a') }
  ] : [];

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 bg-background data-[state=open]:duration-0 [&>button]:hidden">
        <ImageViewHeader onClose={onClose} />
        
        <div className="flex h-full">
          <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30 p-8">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="max-w-full max-h-[calc(100vh-4rem)] object-contain"
              onDoubleClick={handleDoubleClick}
            />
            <HeartAnimation isAnimating={isAnimating} />
          </div>

          <div className="w-[400px] p-4">
            <div className="bg-card h-[calc(100vh-32px)] rounded-lg border shadow-sm">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {session && (
                    <>
                      <ImageOwnerHeader 
                        owner={owner}
                        image={image}
                        isOwner={isOwner}
                        userLikes={userLikes}
                        toggleLike={toggleLike}
                        likeCount={likeCount}
                      />

                      <ImageViewActions 
                        onDownload={onDownload}
                        onDiscard={handleDiscardImage}
                        onRemixClick={handleRemixClick}
                        isOwner={isOwner}
                      />
                    </>
                  )}

                  <ImagePromptSection 
                    prompt={image.user_prompt || image.prompt}
                    copyIcon={copyIcon}
                    shareIcon={shareIcon}
                    onCopyPrompt={handleCopyPrompt}
                    onShare={handleShare}
                  />

                  <ImageDetailsSection detailItems={detailItems} />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;