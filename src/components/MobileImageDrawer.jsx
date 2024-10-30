import React from 'react';
import { Drawer } from 'vaul';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Wand2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { styleConfigs } from '@/utils/styleConfigs';
import { modelConfigs } from '@/utils/modelConfigs';

const MobileImageDrawer = ({ open, onOpenChange, image, showImage, onDownload, onDiscard, onRemix, isOwner }) => {
  if (!image) return null;

  const detailItems = [
    { label: "Model", value: modelConfigs[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ];

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="bg-background flex flex-col fixed inset-0 z-[60]">
          <div className="p-4 bg-muted/40 flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-8" />
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="max-w-md mx-auto space-y-6">
                {showImage && (
                  <div className="relative rounded-lg overflow-hidden mb-4">
                    <img
                      src={supabase.storage.from('user-images').getPublicUrl(image?.storage_path).data.publicUrl}
                      alt={image?.prompt}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Prompt</h3>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                    {image.prompt}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {detailItems.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <Badge variant="outline" className="text-sm font-normal">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image?.storage_path).data.publicUrl, image?.prompt)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {isOwner && (
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-destructive"
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
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onRemix(image);
                      onOpenChange(false);
                    }}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
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