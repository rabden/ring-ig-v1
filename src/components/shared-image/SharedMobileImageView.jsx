import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Copy, Share2, Check } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { toast } from 'sonner';
import { getCleanPrompt } from '@/utils/promptUtils';
import ImageOwnerHeader from '../image-view/ImageOwnerHeader';
import ImageDetailsSection from '../image-view/ImageDetailsSection';
import { useQuery } from '@tanstack/react-query';
import { useLikes } from '@/hooks/useLikes';

const SharedMobileImageView = ({ image, onDownload, onRemix, session }) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  const { userLikes, toggleLike } = useLikes(session?.user?.id);

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
    await navigator.clipboard.writeText(getCleanPrompt(image.user_prompt || image.prompt, image.style));
    setCopyIcon('check');
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setCopyIcon('copy'), 1500);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShareIcon('check');
    toast.success('Share link copied to clipboard');
    setTimeout(() => setShareIcon('share'), 1500);
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
    <div className="min-h-screen bg-background">
      <div className="h-full">
        <ScrollArea className="h-screen">
          <div className="p-4 space-y-6">
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img
                src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                alt={image.prompt}
                className="w-full h-auto"
              />
            </div>

            <ImageOwnerHeader 
              owner={owner}
              image={image}
              isOwner={image.user_id === session?.user?.id}
              userLikes={userLikes}
              toggleLike={toggleLike}
              likeCount={likeCount}
            />

            {session && (
              <div className="flex gap-2 justify-between mb-6">
                <Button variant="ghost" size="sm" className="flex-1" onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={onRemix}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Remix
                </Button>
              </div>
            )}

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

            <ImageDetailsSection detailItems={detailItems} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SharedMobileImageView;