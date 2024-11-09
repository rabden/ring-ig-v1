import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, RefreshCw, Copy, Share2, Check, Image, GalleryHorizontal } from "lucide-react";
import { toast } from 'sonner';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useQuery } from '@tanstack/react-query';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { getCleanPrompt } from '@/utils/promptUtils';
import TruncatablePrompt from './TruncatablePrompt';
import { handleImageDiscard } from '@/utils/discardUtils';
import { useImageRemix } from '@/hooks/useImageRemix';

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
  const { handleRemix } = useImageRemix(session, onRemix, setStyle, setActiveTab, () => onOpenChange(false));

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
    try {
      await handleImageDiscard(image);
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleDiscard:', error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[100dvh] bg-background">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mt-4" />
        
        <div className="flex flex-col h-[calc(100dvh-24px)]">
          {/* Image Section */}
          <div className="relative bg-black/5 dark:bg-black/20">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="w-full h-auto max-h-[40vh] object-contain"
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-4">
              {/* Action Buttons */}
              {session && (
                <div className="flex gap-2 justify-between py-4 border-b">
                  <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {isOwner && (
                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={handleDiscard}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Discard
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleRemix(image)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                </div>
              )}

              {/* Prompt Section */}
              <div className="py-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Prompt</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyPrompt}>
                      {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                      {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <TruncatablePrompt prompt={getCleanPrompt(image.user_prompt || image.prompt, image.style)} />
              </div>

              {/* Details Section */}
              <div className="py-4 space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Image Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Model</p>
                    <p className="text-sm font-medium">{modelConfigs?.[image.model]?.name || image.model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Style</p>
                    <p className="text-sm font-medium">{styleConfigs?.[image.style]?.name || 'General'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="text-sm font-medium">{image.width}x{image.height}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Quality</p>
                    <p className="text-sm font-medium">{image.quality}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileImageDrawer;