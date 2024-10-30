import React from 'react';
import { Drawer } from 'vaul';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Wand2, Info } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";

const MobileImageDrawer = ({ open, onOpenChange, image, showImage, onDownload, onDiscard, onRemix, isOwner }) => {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-background flex flex-col fixed inset-0 z-40">
          <div className="p-4 bg-muted/40 flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-8" />
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="max-w-md mx-auto">
                {showImage && (
                  <div className="relative rounded-lg overflow-hidden mb-4">
                    <img
                      src={supabase.storage.from('user-images').getPublicUrl(image?.storage_path).data.publicUrl}
                      alt={image?.prompt}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                <div className="space-y-2">
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
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onOpenChange(false);
                    }}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    View Details
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