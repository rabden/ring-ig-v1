import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Wand2, Copy, Share2, Check } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { toast } from 'sonner';

const MobileImageDrawer = ({ 
  open, 
  onOpenChange, 
  image, 
  showImage, 
  onDownload, 
  onDiscard, 
  onRemix, 
  isOwner,
  setActiveTab,
  setStyle 
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  
  if (!image) return null;

  const handleCopyPrompt = async () => {
    // Only copy the user's prompt without the style suffix
    await navigator.clipboard.writeText(image.prompt);
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

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
      <Drawer.Portal>
        <Drawer.Content className="bg-background fixed inset-x-0 bottom-0 z-50 rounded-t-[10px]">
          <div className="h-full max-h-[96vh] overflow-hidden">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 my-4" />
            <ScrollArea className="h-[calc(96vh-32px)] px-4 pb-8">
              {showImage && (
                <div className="relative rounded-lg overflow-hidden mb-4">
                  <img
                    src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                    alt={image.prompt}
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              <div className="flex gap-2 justify-between mb-6">
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

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Prompt</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words">
                    {image.prompt}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {modelConfigs?.[image.model]?.name || image.model}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Style</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {styleConfigs?.[image.style]?.name || "General"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Size</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {image.width}x{image.height}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Quality</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {image.quality}
                    </Badge>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileImageDrawer;