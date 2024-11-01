import React from 'react';
import { Drawer } from 'vaul';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Wand2, Copy, Crown } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { toast } from 'sonner';

const MobileImageDrawer = ({ open, onOpenChange, image, showImage, onDownload, onDiscard, onRemix, isOwner }) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  
  if (!image) return null;

  const premiumStyles = ['anime', '3d', 'realistic', 'illustration', 'concept', 'watercolor', 'comic', 'minimalist', 'cyberpunk', 'retro'];
  const premiumAspectRatios = ['21:9', '9:21', '1.91:1', '1:1.91'];
  const premiumModels = ['flux', 'fluxDev', 'nsfwPro'];

  const detailItems = [
    { 
      label: "Model", 
      value: modelConfigs?.[image.model]?.name || image.model,
      isPro: premiumModels.includes(image.model)
    },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { 
      label: "Aspect Ratio", 
      value: image.aspect_ratio,
      isPro: premiumAspectRatios.includes(image.aspect_ratio)
    },
    { 
      label: "Style", 
      value: styleConfigs?.[image.style]?.name || 'General',
      isPro: premiumStyles.includes(image.style)
    },
    { label: "Quality", value: image.quality },
  ];

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      toast.success('Prompt copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="bg-background flex flex-col fixed bottom-0 left-0 right-0 z-[60] h-[85vh] rounded-t-[16px]">
          <div className="p-4 bg-muted/40 overflow-hidden h-full rounded-t-[16px]">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-4" />
            <ScrollArea className="h-[calc(85vh-80px)]">
              <div className="max-w-md mx-auto space-y-4 px-2 pb-6">
                {showImage && (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={supabase.storage.from('user-images').getPublicUrl(image?.storage_path).data.publicUrl}
                      alt={image?.prompt}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="flex gap-2 justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image?.storage_path).data.publicUrl, image?.prompt)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive text-xs sm:text-sm"
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
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => {
                      onRemix(image);
                      onOpenChange(false);
                    }}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Prompt</h3>
                      <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                        <Copy className="h-4 w-4" />
                      </Button>
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
                          {item.isPro && <Crown className="h-3 w-3 ml-1" />}
                        </Badge>
                      </div>
                    ))}
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