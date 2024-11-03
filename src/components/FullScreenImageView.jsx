import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import ImageDetails from './image-details/ImageDetails';

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDownload,
  onDiscard,
  onRemix,
  isOwner 
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  
  if (!isOpen || !image) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 bg-background" hideCloseButton>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-4 top-4 z-50" 
          onClick={onClose}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex h-full">
          <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="max-w-full max-h-[100vh] object-contain"
            />
          </div>

          <div className="w-[350px] h-[calc(100vh-2rem)] my-4 mr-4 rounded-lg border bg-background">
            <ScrollArea className="h-full scrollbar-custom">
              <div className="p-6">
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium">Actions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button onClick={onDownload} className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    {isOwner && (
                      <Button onClick={onDiscard} className="w-full" variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Discard
                      </Button>
                    )}
                    <Button onClick={onRemix} className="w-full" variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Remix
                    </Button>
                  </div>
                </div>

                <ImageDetails
                  image={image}
                  modelConfigs={modelConfigs}
                  styleConfigs={styleConfigs}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;