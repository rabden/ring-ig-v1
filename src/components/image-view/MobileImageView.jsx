import React from 'react';
import { Drawer } from 'vaul';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Copy, Share2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { useImageRemix } from '@/hooks/useImageRemix';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const MobileImageView = ({ image, session, modelConfigs }) => {
  const { session: authSession } = useSupabaseAuth();
  const { handleRemix } = useImageRemix(authSession);
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success('Prompt copied to clipboard');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Share Image',
        text: image.prompt,
        url: window.location.href
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Drawer.Root defaultOpen>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background fixed inset-x-0 bottom-0 rounded-t-[10px]">
          <div className="h-full max-h-[96vh] overflow-hidden">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 my-4" />
            <ScrollArea className="h-[calc(96vh-32px)] px-4 pb-8">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt}
                  className="w-full h-auto"
                />
              </div>
              
              {session && (
                <div className="flex gap-2 justify-between mb-6">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDownload(image)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleRemix(image)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                </div>
              )}

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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                    <p className="text-sm">
                      {modelConfigs?.[image.model]?.name || image.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quality</p>
                    <p className="text-sm">
                      {image.quality || "Standard"}
                    </p>
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

export default MobileImageView;