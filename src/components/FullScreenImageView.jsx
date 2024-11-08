import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, Trash2, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import ProfileAvatar from './profile/ProfileAvatar';
import LikeButton from './LikeButton';
import { useLikes } from '@/hooks/useLikes';
import { useQuery } from '@tanstack/react-query';
import ImagePromptSection from './image-view/ImagePromptSection';
import ImageDetailsSection from './image-view/ImageDetailsSection';
import ImagePrivacyToggle from './image-view/ImagePrivacyToggle';
import { getCleanPrompt } from '@/utils/promptUtils';
import { deleteImageCompletely } from '@/integrations/supabase/imageUtils';

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDownload,
  onDiscard,
  isOwner
}) => {
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  const { userLikes, toggleLike } = useLikes(session?.user?.id);

  const { data: owner } = useQuery({
    queryKey: ['user', image?.user_id],
    queryFn: async () => {
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
      const { count } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('image_id', image.id);
      return count;
    },
    enabled: !!image?.id
  });
  
  if (!isOpen || !image) return null;

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(getCleanPrompt(image.user_prompt || image.prompt, image.style));
    setCopyIcon('check');
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setCopyIcon('copy'), 1500);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/image/${image.id}`);
    setShareIcon('check');
    toast.success('Share link copied to clipboard');
    setTimeout(() => setShareIcon('share'), 1500);
  };

  const handleDiscard = async () => {
    if (!image?.id) {
      toast.error('Cannot delete image: Invalid image ID');
      return;
    }
    try {
      await deleteImageCompletely(image.id);
      toast.success('Image deleted successfully');
      onClose();
      if (onDiscard) {
        onDiscard(image);
      }
    } catch (error) {
      toast.error('Failed to delete image');
      console.error('Error deleting image:', error);
    }
  };

  const detailItems = [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio || "1:1" },
    { label: "Quality", value: image.quality },
    { label: "Style", value: styleConfigs?.[image.style]?.name || 'General' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 bg-background data-[state=open]:duration-0 [&>button]:hidden">
        <div className="absolute left-4 top-4 z-50">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex h-full">
          <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30 p-8">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="max-w-full max-h-[calc(100vh-4rem)] object-contain"
            />
          </div>

          <div className="w-[400px] p-4">
            <div className="bg-card h-[calc(100vh-32px)] rounded-lg border shadow-sm">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ProfileAvatar user={{ user_metadata: { avatar_url: owner?.avatar_url } }} size="sm" />
                      <span className="text-sm font-medium">{owner?.display_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImagePrivacyToggle image={image} isOwner={isOwner} />
                      <div className="flex items-center gap-1">
                        <LikeButton 
                          isLiked={userLikes?.includes(image.id)} 
                          onToggle={() => toggleLike(image.id)} 
                        />
                        <span className="text-xs text-muted-foreground">{likeCount}</span>
                      </div>
                    </div>
                  </div>

                  <ImagePromptSection 
                    prompt={getCleanPrompt(image.user_prompt || image.prompt, image.style)}
                    style={image.style}
                    copyIcon={copyIcon}
                    shareIcon={shareIcon}
                    onCopyPrompt={handleCopyPrompt}
                    onShare={handleShare}
                  />

                  {session && (
                    <div className="flex gap-2 justify-between">
                      <Button onClick={onDownload} className="flex-1" variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      {isOwner && (
                        <Button onClick={handleDiscard} className="flex-1 text-destructive hover:text-destructive" variant="ghost" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Discard
                        </Button>
                      )}
                    </div>
                  )}

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