import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Wand2, Copy, Crown, Share2, Check } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { toast } from 'sonner';

const MobileImageDrawer = ({ open, onOpenChange, image, showImage, onDownload, onDiscard, onRemix, isOwner }) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyPromptIcon, setCopyPromptIcon] = useState(<Copy className="h-4 w-4" />);
  const [copyShareIcon, setCopyShareIcon] = useState(<Share2 className="h-4 w-4" />);
  
  if (!image) return null;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopyPromptIcon(<Check className="h-4 w-4" />);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => setCopyPromptIcon(<Copy className="h-4 w-4" />), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = image.prompt;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyPromptIcon(<Check className="h-4 w-4" />);
        toast.success('Prompt copied to clipboard');
        setTimeout(() => setCopyPromptIcon(<Copy className="h-4 w-4" />), 2000);
      } catch (err) {
        toast.error('Failed to copy prompt');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/image/${image.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyShareIcon(<Check className="h-4 w-4" />);
      toast.success('Share link copied to clipboard');
      setTimeout(() => setCopyShareIcon(<Share2 className="h-4 w-4" />), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyShareIcon(<Check className="h-4 w-4" />);
        toast.success('Share link copied to clipboard');
        setTimeout(() => setCopyShareIcon(<Share2 className="h-4 w-4" />), 2000);
      } catch (err) {
        toast.error('Failed to copy share link');
      }
      document.body.removeChild(textArea);
    }
  };

  const detailItems = [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Quality", value: image.quality },
    { label: "Style", value: styleConfigs?.[image.style]?.name || 'General' },
  ];

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="bg-background fixed inset-x-0 bottom-0 z-[60] rounded-t-[10px]">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => {
                      onDiscard(image);
                      onOpenChange(false);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    onRemix(image);
                    onOpenChange(false);
                  }}
                >
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
                  {detailItems.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <Badge variant="outline" className="text-xs sm:text-sm font-normal flex items-center gap-1 w-fit">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
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