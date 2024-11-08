import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Wand2, Copy, Share2, Check } from "lucide-react";
import { toast } from 'sonner';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProfileAvatar from './profile/ProfileAvatar';
import LikeButton from './LikeButton';
import { useLikes } from '@/hooks/useLikes';
import { useQuery } from '@tanstack/react-query';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { getCleanPrompt } from '@/utils/promptUtils';

const MobileImageDrawer = ({ 
  open, 
  onOpenChange, 
  image, 
  onDownload, 
  onDiscard, 
  onRemix, 
  isOwner,
  setActiveTab,
  setStyle,
  showFullImage = false
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
  
  if (!image) return null;

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

  const handleRemixClick = () => {
    onRemix(image);
    setStyle(image.style);
    setActiveTab('input');
    onOpenChange(false);
  };

  const detailItems = [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Quality", value: image.quality },
    { label: "Style", value: styleConfigs?.[image.style]?.name || "General" },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[100vh] bg-background">
        <div className="mx-auto w-12 h-1 flex-shrink-0 rounded-full bg-muted mt-4 mb-2" />
        <ScrollArea className="h-[calc(100vh-24px)] px-4 pb-8">
          {showFullImage && (
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                alt={image.prompt}
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ProfileAvatar user={{ user_metadata: { avatar_url: owner?.avatar_url } }} size="sm" />
                <span className="text-sm font-medium">{owner?.display_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <LikeButton 
                  isLiked={userLikes?.includes(image.id)} 
                  onToggle={() => toggleLike(image.id)} 
                />
                <span className="text-xs text-muted-foreground">{likeCount}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Prompt</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                    {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words">
                {getCleanPrompt(image.user_prompt || image.prompt, image.style)}
              </p>
            </div>
            
            <div className="flex gap-2 justify-between">
              <Button variant="ghost" size="sm" className="flex-1" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              {isOwner && (
                <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={onDiscard}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Discard
                </Button>
              )}
              <Button variant="ghost" size="sm" className="flex-1" onClick={handleRemixClick}>
                <Wand2 className="mr-2 h-4 w-4" />
                Remix
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {detailItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <Badge variant="secondary" className="text-xs sm:text-sm font-normal w-full justify-center">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileImageDrawer;
