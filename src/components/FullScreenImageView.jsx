import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Trash2, X } from "lucide-react";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageRemix } from '@/hooks/useImageRemix';
import { supabase } from '@/integrations/supabase/supabase';

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose, 
  onDownload, 
  onDiscard, 
  isOwner,
  setStyle,
  setActiveTab 
}) => {
  const { session } = useSupabaseAuth();
  const { handleRemix } = useImageRemix(session);

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        <div className="relative flex flex-col h-full">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="flex-1 mr-4">
              <p className="text-sm text-muted-foreground break-words">{image.prompt}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button 
                variant="secondary" 
                size="icon"
                onClick={() => onDownload(image)}
              >
                <Download className="h-4 w-4" />
              </Button>
              {session && (
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={() => handleRemix(image, () => {}, setStyle, setActiveTab, onClose)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              {isOwner && (
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => onDiscard(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;